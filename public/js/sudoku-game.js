(() => {
  const root = document.querySelector('[data-sudoku]');
  if (!root) return;

  const requestedDifficulty = root.dataset.difficulty || 'daily';
  const boardEl = root.querySelector('[data-sudoku-board]');
  const timerEl = root.querySelector('[data-timer]');
  const mistakesEl = root.querySelector('[data-mistakes]');
  const difficultyEls = [...root.querySelectorAll('[data-difficulty-label]')];
  const statusEl = root.querySelector('[data-status]');
  const notesButton = root.querySelector('[data-tool="notes"]');
  const pauseLayer = root.querySelector('[data-pause-layer]');
  const resultDialog = root.querySelector('[data-result-dialog]');
  const statsDialog = root.querySelector('[data-stats-dialog]');
  const resultSummary = root.querySelector('[data-result-summary]');
  const statsKey = 'pocket-sudoku:stats:v1';

  let data = null;
  let difficulty = 'medium';
  let puzzle = null;
  let state = null;
  let cells = [];
  let tickHandle = null;
  let lastSavedSecond = -1;

  const safeParse = (value, fallback) => { try { return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
  const todayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone:'Asia/Seoul', year:'numeric', month:'2-digit', day:'2-digit' }).format(new Date());
  const hashText = (text) => { let hash=2166136261; for (let i=0;i<text.length;i+=1){hash^=text.charCodeAt(i);hash=Math.imul(hash,16777619);} return hash>>>0; };
  const labels = { easy:'초급', medium:'중급', hard:'고급' };
  const stateKey = () => requestedDifficulty === 'daily' ? `pocket-sudoku:daily:${todayKey()}` : `pocket-sudoku:${difficulty}:current`;
  const emptyStats = () => ({ played:0, completed:0, currentStreak:0, maxStreak:0, lastDaily:'', bestTimes:{ easy:null, medium:null, hard:null } });
  const loadStats = () => ({ ...emptyStats(), ...safeParse(localStorage.getItem(statsKey), {}), bestTimes:{...emptyStats().bestTimes,...safeParse(localStorage.getItem(statsKey), {})?.bestTimes} });
  const saveStats = (stats) => localStorage.setItem(statsKey, JSON.stringify(stats));
  const saveState = () => localStorage.setItem(stateKey(), JSON.stringify(state));
  const dateDiff = (a,b) => Math.round((Date.parse(a+'T00:00:00Z')-Date.parse(b+'T00:00:00Z'))/86400000);

  function chooseDifficulty() {
    if (requestedDifficulty !== 'daily') return requestedDifficulty;
    const order = ['easy','medium','hard'];
    return order[hashText(`포켓스도쿠:${todayKey()}:난이도`) % order.length];
  }

  function choosePuzzleId(forceRandom = false) {
    const list = data[difficulty];
    if (requestedDifficulty === 'daily') return list[hashText(`포켓스도쿠:${todayKey()}:${difficulty}`) % list.length].id;
    if (forceRandom) {
      const candidates = list.filter((item) => item.id !== puzzle?.id);
      return candidates[Math.floor(Math.random() * candidates.length)].id;
    }
    return list[Math.floor(Math.random() * list.length)].id;
  }

  function freshState(puzzleId) {
    const item = data[difficulty].find((entry) => entry.id === puzzleId);
    return {
      puzzleId,
      values:[...item.puzzle].map(Number),
      notes:Array.from({length:81},()=>[]),
      selected:item.puzzle.indexOf('0'),
      elapsed:0,
      mistakes:0,
      hints:0,
      noteMode:false,
      paused:false,
      completed:false,
      statsRecorded:false,
      history:[]
    };
  }

  function loadState(forceNew = false) {
    difficulty = chooseDifficulty();
    const stored = forceNew ? null : safeParse(localStorage.getItem(stateKey()), null);
    const valid = stored && data[difficulty].some((entry) => entry.id === stored.puzzleId) && Array.isArray(stored.values) && stored.values.length === 81;
    state = valid ? {
      ...freshState(stored.puzzleId), ...stored,
      notes:Array.isArray(stored.notes) && stored.notes.length === 81 ? stored.notes.map((n)=>Array.isArray(n)?n:[]) : Array.from({length:81},()=>[]),
      history:Array.isArray(stored.history) ? stored.history.slice(-30) : [],
      paused:false
    } : freshState(choosePuzzleId(forceNew));
    puzzle = data[difficulty].find((entry) => entry.id === state.puzzleId);
    saveState();
  }

  function buildBoard() {
    boardEl.innerHTML='';
    cells=[];
    for(let i=0;i<81;i+=1){
      const button=document.createElement('button');
      button.type='button'; button.className='sudoku-cell'; button.dataset.index=String(i);
      button.setAttribute('role','gridcell');
      button.setAttribute('aria-label',`${Math.floor(i/9)+1}행 ${i%9+1}열`);
      const notes=document.createElement('span'); notes.className='notes'; notes.setAttribute('aria-hidden','true');
      for(let n=1;n<=9;n+=1){const span=document.createElement('span');span.dataset.note=String(n);notes.appendChild(span);}
      button.appendChild(notes);
      button.addEventListener('click',()=>selectCell(i));
      boardEl.appendChild(button); cells.push(button);
    }
  }

  function peersOf(index){
    const r=Math.floor(index/9), c=index%9, bR=Math.floor(r/3)*3, bC=Math.floor(c/3)*3;
    const set=new Set();
    for(let n=0;n<9;n+=1){set.add(r*9+n);set.add(n*9+c);}
    for(let rr=bR;rr<bR+3;rr+=1)for(let cc=bC;cc<bC+3;cc+=1)set.add(rr*9+cc);
    set.delete(index); return set;
  }

  function renderBoard() {
    const selectedValue = state.selected >= 0 ? state.values[state.selected] : 0;
    const peers = state.selected >= 0 ? peersOf(state.selected) : new Set();
    cells.forEach((cell,index)=>{
      const given=Number(puzzle.puzzle[index])!==0;
      const value=state.values[index];
      cell.className='sudoku-cell';
      if(given)cell.classList.add('given');
      if(index===state.selected)cell.classList.add('selected');
      else if(peers.has(index))cell.classList.add('peer');
      if(selectedValue && value===selectedValue && index!==state.selected)cell.classList.add('same');
      if(value && value!==Number(puzzle.solution[index]))cell.classList.add('error');
      const notesEl=cell.querySelector('.notes');
      [...notesEl.children].forEach((span,n)=>span.textContent=state.notes[index]?.includes(n+1)?String(n+1):'');
      const oldText=[...cell.childNodes].find((node)=>node.nodeType===Node.TEXT_NODE);
      if(oldText)oldText.remove();
      if(value) cell.insertBefore(document.createTextNode(String(value)), notesEl);
      cell.setAttribute('aria-label',`${Math.floor(index/9)+1}행 ${index%9+1}열${given?' 고정 숫자':''}${value?` 값 ${value}`:state.notes[index]?.length?` 메모 ${state.notes[index].join(',')}`:' 빈칸'}`);
      cell.disabled=state.paused;
    });
    root.querySelectorAll('[data-number]').forEach((button)=>{
      const n=Number(button.dataset.number);
      const count=state.values.filter((v)=>v===n).length;
      button.disabled=state.completed || state.paused || count>=9;
      button.classList.toggle('active',selectedValue===n);
    });
  }

  function formatTime(seconds){const m=Math.floor(seconds/60);const s=seconds%60;return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;}

  function renderMeta(){
    timerEl.textContent=formatTime(state.elapsed);
    mistakesEl.textContent=String(state.mistakes);
    difficultyEls.forEach((el)=>el.textContent=labels[difficulty]);
    notesButton.setAttribute('aria-pressed',String(state.noteMode));
    pauseLayer.hidden=!state.paused;
    root.querySelectorAll('[data-tool]').forEach((button)=>{ if(button.dataset.tool!=='pause') button.disabled=state.completed||state.paused; });
    const pauseButton=root.querySelector('[data-tool="pause"]');
    if(pauseButton)pauseButton.textContent=state.paused?'계속':'일시정지';
    root.querySelectorAll('[data-share-result]').forEach((button)=>{
      button.disabled=!state.completed;
      button.setAttribute('aria-disabled', String(!state.completed));
    });
    renderStats();
  }

  function render(){renderBoard();renderMeta(); if(state.completed) showResult(false);}

  function selectCell(index){ if(state.paused||state.completed)return; state.selected=index; saveState(); renderBoard(); }

  function snapshot(){return {values:[...state.values],notes:state.notes.map((n)=>[...n]),mistakes:state.mistakes,hints:state.hints};}
  function pushHistory(){state.history.push(snapshot());if(state.history.length>30)state.history.shift();}

  function removePeerNotes(index,value){peersOf(index).forEach((peer)=>{state.notes[peer]=state.notes[peer].filter((n)=>n!==value);});}

  function enterNumber(number){
    const i=state.selected;
    if(i<0||state.paused||state.completed||Number(puzzle.puzzle[i])!==0)return;
    pushHistory();
    if(state.noteMode && state.values[i]===0){
      const set=new Set(state.notes[i]); set.has(number)?set.delete(number):set.add(number); state.notes[i]=[...set].sort();
      statusEl.textContent=`${number} 메모를 ${set.has(number)?'추가':'삭제'}했어요.`;
    }else{
      state.notes[i]=[]; state.values[i]=number;
      if(number!==Number(puzzle.solution[i])){state.mistakes+=1;statusEl.textContent='이 칸에는 다른 숫자가 들어갑니다.';navigator.vibrate?.(35);}
      else{removePeerNotes(i,number);statusEl.textContent='좋아요. 다음 빈칸을 선택하세요.';autoSelectNext();}
    }
    saveState();render();checkComplete();
  }

  function autoSelectNext(){
    for(let offset=1;offset<=81;offset+=1){const i=(state.selected+offset)%81;if(Number(puzzle.puzzle[i])===0&&state.values[i]===0){state.selected=i;return;}}
  }

  function erase(){
    const i=state.selected;if(i<0||state.paused||state.completed||Number(puzzle.puzzle[i])!==0)return;
    if(!state.values[i]&&!state.notes[i].length)return;
    pushHistory();state.values[i]=0;state.notes[i]=[];saveState();render();statusEl.textContent='선택한 칸을 지웠어요.';
  }

  function undo(){
    const prev=state.history.pop();if(!prev||state.paused||state.completed){window.showToast?.('되돌릴 내용이 없어요.');return;}
    Object.assign(state,prev);saveState();render();statusEl.textContent='한 단계를 되돌렸어요.';
  }

  function hint(){
    if(state.paused||state.completed)return;
    let i=state.selected;
    if(i<0||Number(puzzle.puzzle[i])!==0||state.values[i]===Number(puzzle.solution[i])) i=state.values.findIndex((value,index)=>Number(puzzle.puzzle[index])===0&&value!==Number(puzzle.solution[index]));
    if(i<0)return;
    pushHistory();state.selected=i;const value=Number(puzzle.solution[i]);state.values[i]=value;state.notes[i]=[];state.hints+=1;removePeerNotes(i,value);saveState();render();statusEl.textContent=`힌트로 ${value}을(를) 채웠어요.`;checkComplete();
  }

  function togglePause(){if(state.completed)return;state.paused=!state.paused;saveState();render();statusEl.textContent=state.paused?'게임을 잠시 멈췄어요.':'게임을 계속합니다.';}
  function toggleNotes(){if(state.paused||state.completed)return;state.noteMode=!state.noteMode;saveState();renderMeta();statusEl.textContent=state.noteMode?'메모 모드가 켜졌어요.':'숫자 입력 모드입니다.';}

  function checkComplete(){
    if(state.values.every((value,index)=>value===Number(puzzle.solution[index]))){state.completed=true;state.paused=false;recordStats();saveState();renderMeta();setTimeout(()=>showResult(true),300);}
  }

  function recordStats(){
    if(state.statsRecorded)return;
    const stats=loadStats();stats.played+=1;stats.completed+=1;
    const best=stats.bestTimes[difficulty];if(best===null||state.elapsed<best)stats.bestTimes[difficulty]=state.elapsed;
    if(requestedDifficulty==='daily'){
      const key=todayKey();stats.currentStreak=stats.lastDaily&&dateDiff(key,stats.lastDaily)===1?stats.currentStreak+1:stats.lastDaily===key?stats.currentStreak:1;stats.maxStreak=Math.max(stats.maxStreak,stats.currentStreak);stats.lastDaily=key;
    }
    saveStats(stats);state.statsRecorded=true;
  }

  function renderStats(){
    const stats=loadStats();
    root.querySelectorAll('[data-stat="completed"]').forEach((el)=>el.textContent=String(stats.completed));
    root.querySelectorAll('[data-stat="streak"]').forEach((el)=>el.textContent=String(stats.currentStreak));
    root.querySelectorAll('[data-stat="max-streak"]').forEach((el)=>el.textContent=String(stats.maxStreak));
    ['easy','medium','hard'].forEach((level)=>root.querySelectorAll(`[data-best="${level}"]`).forEach((el)=>el.textContent=stats.bestTimes[level]===null?'--:--':formatTime(stats.bestTimes[level])));
  }

  function showResult(open=true){
    resultSummary.textContent=`${labels[difficulty]} · ${formatTime(state.elapsed)} · 실수 ${state.mistakes}회 · 힌트 ${state.hints}회`;
    if(open&&typeof resultDialog.showModal==='function')resultDialog.showModal();
  }

  async function shareResult(){
    if(!state.completed){window.showToast?.('완료 후 공유할 수 있어요.');return;}
    const text=`포켓 스도쿠 ${requestedDifficulty==='daily'?todayKey():'연습'}\n${labels[difficulty]} ${formatTime(state.elapsed)} · 실수 ${state.mistakes} · 힌트 ${state.hints}\n🟩 완료\n${location.origin}`;
    try{if(navigator.share)await navigator.share({title:'포켓 스도쿠 결과',text});else{await navigator.clipboard.writeText(text);window.showToast?.('결과를 복사했어요.');}}catch(error){if(error?.name!=='AbortError')window.showToast?.('공유하지 못했어요.');}
  }

  function newPuzzle(){
    if(requestedDifficulty==='daily'){window.showToast?.('오늘의 퍼즐은 하루에 하나입니다.');return;}
    const key=stateKey();localStorage.removeItem(key);loadState(true);buildBoard();render();resultDialog?.close();statusEl.textContent='새 퍼즐을 시작합니다.';
  }

  function tick(){
    if(!state||state.paused||state.completed)return;
    state.elapsed+=1;timerEl.textContent=formatTime(state.elapsed);
    if(state.elapsed-lastSavedSecond>=10){lastSavedSecond=state.elapsed;saveState();}
  }

  root.querySelectorAll('[data-number]').forEach((button)=>button.addEventListener('click',()=>enterNumber(Number(button.dataset.number))));
  root.querySelector('[data-tool="erase"]')?.addEventListener('click',erase);
  root.querySelector('[data-tool="undo"]')?.addEventListener('click',undo);
  root.querySelector('[data-tool="hint"]')?.addEventListener('click',hint);
  notesButton?.addEventListener('click',toggleNotes);
  root.querySelector('[data-tool="pause"]')?.addEventListener('click',togglePause);
  pauseLayer?.addEventListener('click',togglePause);
  root.querySelectorAll('[data-new-puzzle]').forEach((button)=>button.addEventListener('click',newPuzzle));
  root.querySelectorAll('[data-share-result]').forEach((button)=>button.addEventListener('click',shareResult));
  root.querySelectorAll('[data-open-stats]').forEach((button)=>button.addEventListener('click',()=>statsDialog?.showModal()));
  root.querySelectorAll('[data-close-dialog]').forEach((button)=>button.addEventListener('click',()=>button.closest('dialog')?.close()));
  document.addEventListener('keydown',(event)=>{
    if(!root.isConnected||state?.paused)return;
    if(/^[1-9]$/.test(event.key)){event.preventDefault();enterNumber(Number(event.key));}
    else if(event.key==='Backspace'||event.key==='Delete'||event.key==='0'){event.preventDefault();erase();}
    else if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)){
      event.preventDefault();const delta={ArrowUp:-9,ArrowDown:9,ArrowLeft:-1,ArrowRight:1}[event.key];const next=state.selected+delta;if(next>=0&&next<81&&!(event.key==='ArrowLeft'&&state.selected%9===0)&&!(event.key==='ArrowRight'&&state.selected%9===8)){state.selected=next;saveState();renderBoard();}
    }
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)saveState();});

  fetch('/data/sudoku.json').then((r)=>{if(!r.ok)throw new Error('data');return r.json();}).then((json)=>{
    data=json;loadState();buildBoard();render();tickHandle=setInterval(tick,1000);
  }).catch(()=>{statusEl.textContent='퍼즐 데이터를 불러오지 못했습니다. 페이지를 새로고침해 주세요.';});
})();

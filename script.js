// ==========================================
// 1. 상태 변수 및 요소 선택
// ==========================================
// 로컬스토리지에 저장된 명단이 있으면 불러오고, 없으면 빈 배열([])로 시작합니다.
let students = JSON.parse(localStorage.getItem('savedStudents')) || [];

const nameInput = document.getElementById('nameInput');
const addBtn = document.getElementById('addBtn');
const pickBtn = document.getElementById('pickBtn');
const resetBtn = document.getElementById('resetBtn');
const resultBox = document.getElementById('resultBox');
const studentList = document.getElementById('studentList');
const studentCount = document.getElementById('studentCount');

// ==========================================
// 2. 로컬스토리지 저장 함수
// ==========================================
// 명단이 추가되거나 삭제될 때마다 브라우저에 저장해 줍니다.
function saveToLocalStorage() {
  localStorage.setItem('savedStudents', JSON.stringify(students));
}

// ==========================================
// 3. 학생 추가 기능 (Enter 키 지원)
// ==========================================
function addStudent() {
  const name = nameInput.value.trim();

  // 빈 칸 검사
  if (name === '') {
    alert('학생 이름을 입력해 주세요! 😊');
    nameInput.focus();
    return;
  }

  // 중복 확인
  if (students.includes(name)) {
    alert('이미 등록된 이름이에요! 동명이인은 번호나 기호를 붙여주세요 (예: 김철수1) 🏷️');
    nameInput.focus();
    return;
  }

  // 명단에 추가, 저장 및 화면 갱신
  students.push(name);
  saveToLocalStorage(); // 💾 저장!
  renderStudents();

  // 입력창 비우고 포커스 유지
  nameInput.value = '';
  nameInput.focus();
}

// ==========================================
// 4. 학생 개별 삭제 기능
// ==========================================
function deleteStudent(index) {
  students.splice(index, 1);
  saveToLocalStorage(); // 💾 저장!
  renderStudents();
}

// ==========================================
// 5. 화면 목록 갱신 기능
// ==========================================
function renderStudents() {
  studentList.innerHTML = '';
  studentCount.textContent = students.length;

  // 등록된 학생이 없을 때 안내
  if (students.length === 0) {
    studentList.innerHTML = '<span style="color: #adb5bd; font-size: 0.95rem; margin: auto;">학생을 추가해주세요.</span>';
    return;
  }

  // 각 학생 태그 생성
  students.forEach((name, index) => {
    const tag = document.createElement('div');
    tag.className = 'student-tag';
    tag.innerHTML = `
      <span>${name}</span>
      <button class="delete-btn" onclick="deleteStudent(${index})" title="삭제">×</button>
    `;
    studentList.appendChild(tag);
  });
}

// ==========================================
// 6. 랜덤 발표자 뽑기 기능 (간단한 롤링 효과)
// ==========================================
let isPicking = false; // 뽑기 중복 클릭 방지

function pickRandomStudent() {
  // 학생이 없는 경우
  if (students.length === 0) {
    alert('먼저 학생 이름을 등록해 주세요! 🙋‍♂️');
    nameInput.focus();
    return;
  }

  if (isPicking) return; // 이미 뽑기 애니메이션 진행 중이면 무시
  isPicking = true;

  let counter = 0;
  const maxShuffle = 15; // 이름이 빠르게 바뀌는 횟수
  
  // 두근두근 롤링 애니메이션
  const interval = setInterval(() => {
    const randomIndex = Math.floor(Math.random() * students.length);
    resultBox.innerHTML = `<span class="winner-name" style="opacity: 0.6;">${students[randomIndex]}</span>`;
    counter++;

    if (counter >= maxShuffle) {
      clearInterval(interval);
      // 최종 발표자 선택
      const finalIndex = Math.floor(Math.random() * students.length);
      const winner = students[finalIndex];
      
      resultBox.innerHTML = `
        <div>
          <div style="font-size: 1.1rem; color: #495057; margin-bottom: 5px;">오늘의 발표자는?</div>
          <div class="winner-name">🎊 ${winner} 🎊</div>
        </div>
      `;
      isPicking = false;
    }
  }, 70);
}

// ==========================================
// 7. 전체 초기화 기능
// ==========================================
function resetAll() {
  if (students.length === 0) {
    alert('초기화할 명단이 없습니다. 😊');
    return;
  }

  // 확인창 띄우기
  const isConfirmed = confirm('정말 모든 학생 명단을 지우시겠습니까? 저장된 명단도 함께 삭제됩니다.');
  if (isConfirmed) {
    students = [];
    localStorage.removeItem('savedStudents'); // 🗑️ 로컬스토리지 데이터도 함께 삭제!
    renderStudents();
    resultBox.innerHTML = '<span class="placeholder">누가 발표하게 될까요? 🤔</span>';
    nameInput.focus();
  }
}

// ==========================================
// 8. 이벤트 리스너 연결
// ==========================================
// 추가 버튼 클릭 시
addBtn.addEventListener('click', addStudent);

// 입력창에서 Enter 키를 눌렀을 때
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addStudent();
  }
});

// 발표자 뽑기 버튼 클릭 시
pickBtn.addEventListener('click', pickRandomStudent);

// 전체 초기화 버튼 클릭 시
resetBtn.addEventListener('click', resetAll);

// 첫 화면 실행 시 저장된 명단 불러와서 화면에 그리기
renderStudents();

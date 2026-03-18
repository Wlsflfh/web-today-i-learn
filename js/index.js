// TODO: TIL 폼 등록 기능을 구현하세요
// 1. 폼 요소와 목록 요소를 querySelector로 선택합니다.
// 2. 폼의 submit 이벤트를 감지하여 새 TIL 항목을 목록에 추가합니다.

const tilForm = document.querySelector("#til-form");
const tilList = document.querySelector("#til-list");

// 1. 다크 모드 버튼 생성 및 초기 테마 설정
const createDarkModeButton = () => {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  // 버튼을 담을 li 생성
  const li = document.createElement("li");
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.innerText = "🌙";

  li.appendChild(toggleBtn);
  navLinks.appendChild(li); // 메뉴 리스트 맨 끝에 추가

  const currentTheme = localStorage.getItem("theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    toggleBtn.innerText = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    let theme = document.documentElement.getAttribute("data-theme");
    if (theme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      toggleBtn.innerText = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      toggleBtn.innerText = "☀️";
    }
  });
};

// 2. TIL 폼 등록 기능
const initTIL = () => {
  const tilForm = document.querySelector("#til-form");
  const tilList = document.querySelector("#til-list");

  // HTML에 해당 ID가 있는지 확인 후 이벤트 연결
  if (tilForm && tilList) {
    tilForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const date = document.querySelector("#til-date").value;
      const title = document.querySelector("#til-title").value;
      const content = document.querySelector("#til-content").value;

      const newItem = document.createElement("article");
      newItem.classList.add("til-item");
      newItem.innerHTML = `
        <time>${date}</time>
        <h3>${title}</h3>
        <p>${content}</p>
      `;

      tilList.appendChild(newItem);
      tilForm.reset();
    });
  }
};

const initGalleryModal = () => {
  const modal = document.querySelector("#image-modal");
  const modalImg = document.querySelector("#modal-img");
  const closeBtn = document.querySelector(".modal-close");
  const galleryImages = document.querySelectorAll(".gallery-grid img");

  // 모든 갤러리 이미지에 클릭 이벤트 추가
  galleryImages.forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "block";
      modalImg.src = img.src; // 클릭한 이미지의 경로를 가져옴
      document.body.style.overflow = "hidden"; // 스크롤 방지
    });
  });

  // 닫기 버튼이나 배경 클릭 시 닫기
  const closeModal = () => {
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // 스크롤 다시 허용
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
};

// 페이지 로드 시 실행
createDarkModeButton();
initTIL();
initGalleryModal();

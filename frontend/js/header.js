

//VISIBLE HEADER WHEN SCROLLED
window.addEventListener('scroll', function () {
  const header = document.querySelector('.navbar')
  header.classList.toggle('header-scrolled', window.scrollY > 0)
})

function hamburgerEvent() {
  //HAMBURGER MENU
  const hamburger = document.querySelector(".hamburger")
  const navMenu = document.querySelector(".nav-menu")

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

  })

  window.addEventListener("scroll", () => {
    if (hamburger.classList.contains("active")) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }
  })
  document.addEventListener("click", (event) => {
    if (
      hamburger.classList.contains("active") &&
      !hamburger.contains(event.target) &&
      !navMenu.contains(event.target)
    ) {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")
    }
  })
}

class Header extends HTMLElement {
  constructor() {
    super()
  }

  connectedCallback() {
    this.innerHTML = `
        <style>

        ::-webkit-scrollbar {
          width: 10px;
          background-color: #d0d0d0;
      }

      ::-webkit-scrollbar-thumb {
          background-color: #a0a0a0;
          border-radius: 8px;
      }

      ::-webkit-scrollbar-thumb:hover {
          background-color: #808080;
      }

      ::-webkit-scrollbar-track:hover {
          background-color: #c0c0c0;
      }

        .navbar {
          background-color: #fff;
          color: initial;
          display: flex;
          justify-content: start;
          align-items: center;
          gap: 35%;
          padding: 10px 20px;
          z-index: 999999;
      }

      .header-scrolled {
        position: -webkit-sticky;
        position: sticky;
        top: 0;
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      }


      .logo img {
          width: 180px;

      }

      .nav-menu {
          list-style: none;
          display: flex;
          gap: 55px;
          padding: 20px;
      }

      .nav-menu li a {
          text-decoration: none;
          color: #4C40F7;
          font-weight: bold;
          font-size: 16px;
          transition: font-size 0.1s;
      }

      .nav-menu li a:hover {
        color: #007bff;
        cursor: pointer;
        transform: scale(1.02);
        transition: transform 0.1s;
      }

      .nav-menu a.active {
        color: #001;
      }

      .nav-menu a:not(.active) {
        color: #8E8E8E;
      }

      .hamburger {
        display: none;
        cursor: pointer;
      }

      .bar {
        display: block;
        width: 25px;
        height: 3px;
        margin: 5px;
        -webkit-transition: all 0.3s ease-in-out;
        background-color: black;

      }

      @media (max-width: 768px){
        .navbar {
          justify-content: space-between;
          padding: 10px 30px;
        }

        .hamburger {
          display: block;
        }

        .contact-button {
          display: none;
        }

        .hamburger.active .bar:nth-child(2){
          opacity: 0;
        }
        .hamburger.active .bar:nth-child(1){
          transform: translateY(8px) rotate(45deg);
        }
        .hamburger.active .bar:nth-child(3){
          transform: translateY(-8px) rotate(-45deg);
        }

        .nav-menu{
          position: fixed;
          left: -100%;
          top: 6%;
          gap: 0;
          flex-direction: column;
          background-color: #ffffffef;
          width: 100%;
          text-align: center;
          transition: 0.3s;
          padding: 0;
        }

        .nav-item {
          margin: 16px 0;

        }

        .nav-menu.active {
          left: 0;
        }

      }

        </style>
        <nav class="navbar">
          <a>
            <div class="logo">
                <img id="logo" src="/assets/logo.png" alt="Logo">
            </div>
          </a>
          <ul class="nav-menu">
            <li class="nav-item" id="nav-students">Student catalog</li>
          </ul>
          <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>

      </nav>
      `
    hamburgerEvent()
  }
}

customElements.define('header-component', Header)

window.addEventListener('load', e => {
  document.getElementById('nav-students').addEventListener('click', e => {
    navigateTo('students')
  })
})
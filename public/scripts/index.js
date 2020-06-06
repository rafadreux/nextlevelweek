const buttonSearch = document.querySelector("#page-home main a")
const modal = document.querySelector("#modal")
const close = document.querySelector("#modal .header a")

buttonSearch.addEventListener("click", () => {
    modal.classList.remove("hide")
})

close.addEventListener("click", () => {
    modal.classList.add("hide")
})

// O código a baixo fecha o modal ao apertar a tecla ESC
window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      modal.classList.add("hide")
    }
  })
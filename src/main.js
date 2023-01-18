import "./css/index.css"
import IMask from "imask"
import Swal from "sweetalert2"

const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img')

function setCardType(type) {
  const colors = {
    "visa": ["#436d99", "2d57f2"],
    "mastercard": ["#df6f29", "#c69347"],
    "default": ["black", "gray"]
  }

  ccBgColor01.setAttribute("fill", colors[type][0])
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}

globalThis.setCardType = setCardType

const securityCode = document.querySelector("#security-code")
const securityCodePattern = {
  mask: "000[0]",
}

const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector("#expiration-date")
const expiratioDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12
    },
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    }
  }
}

const expirationDateMasked = IMask(expirationDate, expiratioDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    }
  ],
  dispatc: function (appended, dynamicMasked) {
    const number = (dynamicMasked.value + appended).replace(/\D/g, "")
    const foundMask = dynamicMasked.compiledMask.fing((item) => {
      return number.match(item.regex)
    })

    return foundMask
  }
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)

document.querySelector("form").addEventListener("submit", (e) => {
  const addButton = document.querySelector("#add-card")

  e.preventDefault()
  addButton.disabled = true
  addButton.innerText = "ENVIANDO..."
  

  setTimeout(() => {
    Swal.fire({
      icon: 'success',
      title: 'Parabéns!',
      text: 'Seu cartão foi adicionado com sucesso!',
    })
    addButton.disabled = false
    addButton.innerText = "ADICIONAR CARTÃO"
  }, 2000)
})

const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  ccHolder.innerText = cardHolder.value.length === 0 ? "NOME DO TTITULAR" : cardHolder.value
})

securityCodeMasked.on("accept", function () {
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText = securityCodeMasked.value.length === 0 ? "123" : securityCodeMasked.value
})

cardNumberMasked.on("accept", function () {
  const ccSecurity = document.querySelector(".cc-number")
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  ccSecurity.innerText = cardNumberMasked.value.length === 0 ? "1234 5678 9012 3456" : cardNumberMasked.value
})

expirationDateMasked.on("accept", function () {
  const ccSecurity = document.querySelector(".cc-extra .value")
  ccSecurity.innerText = expirationDateMasked.value.length === 0 ? "01/32" : expirationDateMasked.value
})

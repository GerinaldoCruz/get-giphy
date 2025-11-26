
const form = document.querySelector('form')
const gifsContainer = document.querySelector('.gifsContainer')
const popupWrapper = document.querySelector('.popup-wrapper')
const popupContent = document.querySelector('.popup-content')

const classNames = ['popup-wrapper', 'popup-close']

const APIKey = 'o2dWCLRvVS4rYAMqmgTI5ogBzbG5B5i0'

const getGIPHYApiUrl = GIFName =>
   `https://api.giphy.com/v1/gifs/search?api_key=${APIKey}&limit=1&q=${GIFName}`

const generateGIFImg = (downsizedGIFUrl, GIFData) => {
   const img = document.createElement('img')
   img.setAttribute('src', downsizedGIFUrl)
   img.setAttribute('title', GIFData.data[0].title )

   return img
}

const showPopup = (error) => {
      popupWrapper.style.display = 'block'
      popupContent.children[0].textContent = 'GIF inexistente'
      popupContent.children[1].textContent = error
}

const hiddenPopup = clickedElement => {
    classNames.forEach(className => {
      if (clickedElement.className === className) {
         popupWrapper.style.display = 'none'
         form.reset()
      }
   })
}

const fetchGIF = async inputValue => {
   try {
      const GIPHYApiUrl = getGIPHYApiUrl(inputValue)
      const response = await fetch(GIPHYApiUrl)
   
      if (!response.ok) {
         throw new Error('Não foi possível obter o GIF 😥')
      }
      return response.json()
   } catch (error) {      
      showPopup(error.message)      
   }
} 

const insertGIFIntoDOM = async inputValue => {
   const GIFData = await fetchGIF(inputValue)
   
   if (!GIFData) return

   const hasNoResults = !GIFData.data || GIFData.data.length === 0
   
   if (hasNoResults) {
      showPopup('Nenhum GIF encontrado para esse termo 😕')
      return
   }

   const downsizedGIFUrl = GIFData.data[0].images.downsized.url
   const img = generateGIFImg(downsizedGIFUrl, GIFData)
   
   gifsContainer.prepend(img)
   form.reset()
}

form.addEventListener('submit', event => {
   event.preventDefault()
   
   const inputValue = event.target.search.value

   insertGIFIntoDOM(inputValue)
})

popupWrapper.addEventListener('click', event => {
   const clickedElement = event.target

   hiddenPopup(clickedElement)
})
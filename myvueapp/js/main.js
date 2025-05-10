//var product = 'Socks'
const app = Vue.createApp({
    data() {
      return {
        product: 'Socks',
        image: './images/socks-image.jpg',
        pijama: './images/pijama.jpg',
        likes: 0,
        inStock: true,
        inventory: 11,
        details: ["Gerson", "Maria", "Joao"],
        variants:[
          {
            variantId: 2234,
            variantColor: "green",
            variantImage: './images/socks-image.jpg'
          },
          {
            variantId: 1122,
            variantColor: "yellow",
            variantImage: './images/bug.jpg'
          }
        ],
        cart:0
      }
      
    },
    methods: {
      changeProduct() 
      {
        this.product = 'cars'
      },
      likeProduct() 
      {
        this.likes++
      },
      addToCart: function () 
      {
        this.cart +=1
      },
      updateProduct: function (variantImage)
      {
        this.image = variantImage
      }


    }

  })
  
  app.mount('#app')
  
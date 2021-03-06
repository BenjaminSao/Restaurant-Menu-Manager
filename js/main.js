//Creates Component
database = firebase.database()
var ref = database.ref()
var items = []
var toedit = ""

// Read Data and append to array
ref.once("value", function(data) {
  if(data.val() != null) {
    var datamenuitems =  data.val()
    var keys = Object.keys(datamenuitems)
    console.log(keys)
    for(var i =0; i < keys.length; i++){
      var name = datamenuitems[keys[i]].name
      var description = datamenuitems[keys[i]].description
      var price = datamenuitems[keys[i]].price
      var imgsrc = datamenuitems[keys[i]].imgsrc

      items.push({name, description, price, imgsrc})
   }
  }
});

Vue.component('itemdialogue', {
  //Add values to component
  data: function () {
    return {
        itemName: null,
        itemDescription: null,
        itemPrice: null,
        itemImg: "",
    }
  },
  //Adds methods
  methods: {
    onSubmit(){
      if(this.itemName && this.itemDescription && this.itemPrice && !isNaN(this.itemPrice)) {
        if(this.itemImg === "") {
          this.itemImg = "http://bulma.io/images/placeholders/1280x960.png"
        }
        let item = {
          name: this.itemName,
          description: this.itemDescription,
          price: this.itemPrice,
          imgsrc: this.itemImg
        }
        items.push(item)
        console.log(items)
        firebase.database().ref(this.itemName).set({
          name: this.itemName,
          description: this.itemDescription,
          price : this.itemPrice,
          imgsrc: this.itemImg
        });
        this.$emit('item-added')
      } else {
        alert(`Please fill in the dialogue correctly!`)
      }
    },
    collaspeDialogue() {
      this.$emit('item-added')
    }
  },
  //HTML code (v-model assigns data to data variables)
  template: `
  <div>
  <p class="pb-6"></p>
    <div class="columns is-centered">
      <form class="form-horizontal">
          <fieldset>
              <div class="field">
                  <label class="label">Menu Item Name *</label>
                  <div class="control">
                      <input v-model="itemName" type="text" class="input is-rounded">
                  </div>
              </div>
              <div class="field">
                  <label class="label">Description *</label>
                  <div class="control">                     
                    <textarea class="textarea is-rounded" v-model = "itemDescription"></textarea>
                  </div>
                </div>
                <label class="label"></label>
                <div class="field has-addons">
                  <div class="control">
                    <a class="button is-static">
                      Price *
                    </a>
                  </div>
                  <div class="control">
                    <input v-model="itemPrice" class="input is-rounded" type="text">
                  </div>
                </div>
                <div class="field">
                  <label class="label">Image URL</label>
                    <div class="control">
                      <input v-model="itemImg" type="text" class="input is-rounded">
                    </div>
                  </div>
                  <button type="button" class="button is-black" @click="onSubmit">Add to Menu</button>
                  <button @click="collaspeDialogue" class="button is-light">Cancel</button>
          </fieldset>
      </form>
    </div>
    <p class="pb-6"></p>
    </div>
  `
})

Vue.component('headings', {
  data: function() {
    return {

    }
  },
  template: `
  <div>
    <section class="hero is-primary" style="background-color: black;">
      <div class="hero-body">
          <div class="container">
              <h1 class="title is-1" style="text-align: center;">Restaurant Menu Manager</h1>
          </div>
      </div>
    </section>
  </div>
  `
})

Vue.component('menuitems', {
  data: function() {
    return {
      items: items,
      toedit: null
    }
  }, 
  methods: {
    deleteitem(item) {
      for(var i=0; i<items.length; i++){
        if (items[i].name === item.name) {
          items.splice(i, 1);
          break;
        }
      }
      firebase.database().ref(item.name).remove()
    },
    edititem(item){
      toedit=item.name
      this.$emit('change-data', toedit)
      this.$emit('show-change-dialogue')
    }
  },
  template: `
  <div>
    <section class="section">
      <div class="container">
          <div class="columns is-multiline is-mobile">
            <div class="column is-half" v-for="items in items">
              <div class="card">
              <div class="card-image">
                  <figure class="image is-4by3">
                    <img :src="items.imgsrc" alt="Image" style="object-fit: cover;">
                  </figure>
                </div>
                <div class="card-content">
                  <div class="media">
                    <div class="media-content">
                      <p class="title is-4">{{ items.name }}</p>\
                      <p class="subtitle is-6">{{ items.price }}</p>
                    </div>
                  </div>
              
                  <div class="content">
                    {{ items.description }}
                    <br>
                  </div>
                  <button id="item" @click="deleteitem(items)" class="button is-danger">Delete</button>
                  <button id="item" @click="edititem(items)" class="button is-light">Edit</button>
                </div>
              </div>
            </div>
          </div>
      </div>
    </section>
  </div>
  `
})

var app = new Vue({
    el: '#app',
    data: {
      items: items,
      toedit: "",
      new_name: "",
      new_description: "",
      new_price: "",
      new_imgsrc: "",
      showItemDialogue: false,
      showChangeDialogue: false
    },
    methods: {
      edititem(item) {
        this.toedit = item
        for(var i=0; i<items.length; i++) {
          if (items[i].name === this.toedit) {
            this.new_name = items[i].name
            this.new_description = items[i].description
            this.new_price = items[i].price
            this.new_imgsrc = items[i].imgsrc
          }
        }
      },
      changeItem() {
        if(this.new_name && this.new_description && this.new_price && !isNaN(this.new_price)) {
          if(this.new_imgsrc === "") {
            this.new_imgsrc = "http://bulma.io/images/placeholders/1280x960.png"
          }
          for(var i=0; i<items.length; i++) {
            if (items[i].name === this.toedit) {
              items[i].name = this.new_name
              items[i].description = this.new_description
              items[i].price = this.new_price
              items[i].imgsrc = this.new_imgsrc
            }
          }
          firebase.database().ref(this.new_name).set({
            name: this.new_name,
            description: this.new_description,
            price : this.new_price,
            imgsrc: this.new_imgsrc
          });
          if(this.new_name != this.toedit){
            firebase.database().ref(this.toedit).remove()
          }
          this.new_name = ""
          this.new_description = ""
          this.new_price = ""
          this.new_imgsrc = ""
        } else {
          alert(`Please fill in the dialogue correctly!`)
        }
      },
      hideDialogue() {
        this.showItemDialogue = false
      }
    }
  })

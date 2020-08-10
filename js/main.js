//Creates Component
database = firebase.database()
var ref = database.ref()
var items = []
var toedit = ""

ref.once("value", function(data) {
  if(data.val() != null) {
    var datamenuitems =  data.val()
    var keys = Object.keys(datamenuitems)
    console.log(keys)
    for(var i =0; i < keys.length; i++){
      var name = datamenuitems[keys[i]].name
      var description = datamenuitems[keys[i]].description
      var price = datamenuitems[keys[i]].price

      items.push({name, description, price})
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
    }
  },
  //Adds methods
  methods: {
    onSubmit(){
      let item = {
        name: this.itemName,
        description: this.itemDescription,
        price: this.itemPrice
      }
      items.push(item)
      console.log(items)
      firebase.database().ref(this.itemName).set({
        name: this.itemName,
        description: this.itemDescription,
        price : this.itemPrice
      });
      this.$emit('item-added')
    }
  },
  //HTML code (v-model assigns data to data variables)
  template: `
    <div>
      <form>
          <label>Menu Item Name</label><br>
          <input v-model="itemName"><br>
          <label>Description</label><br>
          <textarea v-model="itemDescription"></textarea><br>
          <label>Price<br>$</label>
          <input v-model="itemPrice"><br>
          <button type="button" class="btn btn-primary" @click="onSubmit">Add to Menu</button>
      </form>
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
      showItemDialogue: false,
      showChangeDialogue: false
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
      edititem(item) {
        this.toedit = item.name
      },
      changeItem() {
        for(var i=0; i<items.length; i++) {
          if (items[i].name === this.toedit) {
            items[i].name = this.new_name
            items[i].description = this.new_description
            items[i].price = this.new_price
          }
        }
      },
      hideDialogue() {
        this.showItemDialogue = false
      }
    }
  })


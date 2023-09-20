// @ts-check

if (!customElements.get('custom-cart-item')) {
  customElements.define(
    'custom-cart-item',
    class CustomCartItems extends HTMLElement {
      cartWrapper: HTMLElement | null;
      removeBtn: HTMLElement | null;
      constructor() {
        super();

        this.cartWrapper = document.getElementById("app");
        this.removeBtn = this.querySelector<HTMLElement>('.remove-btn');

        if(this.removeBtn) {
        this.removeBtn.onclick = (event: Event) => {
        
            if (!(event.target instanceof HTMLButtonElement)) {
              return;
            }
            
            if (event.target.dataset.index) {
              this.removeItem(event.target.dataset.index)
            }
          }
        }

        const addBtn = this.querySelector<HTMLElement>('.add-btn');
        if(addBtn) {
          addBtn.onclick = (event: Event) => {
            if (!(event.target instanceof HTMLButtonElement)) {
              return;
            }
            if (event.target.dataset.index && event.target.dataset.qty) {
              this.updateQuantity(event.target.dataset.index, parseInt(event.target.dataset.qty) + 1 );
            }
          }
        }
      
        const minusBtn = this.querySelector<HTMLElement>('.minus-btn');
        if(minusBtn) {
          minusBtn.onclick = (event: Event) => {
            if (!(event.target instanceof HTMLButtonElement)) {
              return;
            }
            if (event.target.dataset.index && event.target.dataset.qty) {
              this.updateQuantity(event.target.dataset.index, parseInt(event.target.dataset.qty) - 1 );
            }
          }
        }

      }
      

      async cartData() {
        const data = fetch(`${routes.cart_url}.json`)
        .then((response) => response.json())
        .catch((e) => {
          console.error(e);
        });
        return await data;
      }

      async renderCart() {
        if(this.cartWrapper) {
          this.cartWrapper.innerHTML = "";
        
          this.cartData().then(cart => {
            console.log(cart)
            cart.items.forEach((item: { title: any; line_price: number; quantity: number; }, index: number)=> {
              const cartIndex = String(index + 1);
              const cartItemElement = document.createElement("div");
              cartItemElement.dataset.index = cartIndex;
              cartItemElement.classList.add('cart__item')
              cartItemElement.innerHTML = `
              <custom-cart-item>
                  <p>Name: ${item.title}</p>
                  <p>Price: ${item.line_price / 100}</p>
                  <p>Quantity: ${item.quantity}</p>
                  <button class="add-btn" data-index="${cartIndex}" data-qty="${item.quantity}">+1</button>
                  <button  class="minus-btn" data-index="${cartIndex}" data-qty="${item.quantity}" ${item.quantity === 1 ? "disabled" : ""}>-1</button>
                  <button class="remove-btn" data-index="${cartIndex}">Remove</button>
                  </custom-cart-item>
              `;
              this.cartWrapper?.appendChild(cartItemElement);
        
            })
          });
        }
      }

      async updateQuantity(line: String, quantity: Number) {
        const body = JSON.stringify({
          'line': line,
          'quantity': quantity,
        });
    
        fetch(`${routes.cart_change_url}.json`, { ...fetchConfig(), ...{ body } })
        .then((response) => response.json())
        .then((json) => {
          console.log(json)
          this.renderCart();
        })
        .catch((e) => {
          console.error(e);
        });
      }

       removeItem(itemIndex: String): void {
        this.updateQuantity(itemIndex, 0);
      }
    })
  }


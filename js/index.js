const // CONSTANT VALUES
cards_amount = 2,
points_element = document.querySelector("#points"),

trueSound = new Audio("../assets/correct.mp3"),
falseSound = new Audio("../assets/incorrect.mp3"),

s_title = document.querySelector("#s-title"),
s_txt = document.querySelector("#s-txt"),

cards = {
  safe: document.querySelector("#safe"),
  unsafe: document.querySelector("#unsafe")
},

situaties = [
  {points: 1, content: "Bij de party wordt er een drank aangeboden.", safe: false},
  {points: 2, content: "Je wordt online benaderd door een man in de 50 die voor naaktfoto's vraagt.", safe: false},
  {points: 1, content: "Bij de diddy party vraagt een vrouw of je met haar naar een plek wilt waar niemand kijkt.", safe: false},
  {points: 1, content: "Bij de diddy party is er een fursuiter die vraagt of je de binnenkant van z'n fursuit wilt zien.", safe: false},
  {points: 2, content: "Iemand voegt je online toe en dreigt naaktfoto's van je door te sturen. Hij zegt dat als je niet naar z'n huis komt dat hij ze rond gaat spreiden.", safe: false},
  {points: 2, content: "Bij de diddy party koopt iemand een niet-alcoholisch drankje voor je.", safe: true},
  {points: 3, content: "Bij de diddy party is er een persoon die heel erg lijkt op een politie-agent. Zij geeft je de optie om je naar huis te brengen.", safe: true},
  {points: 1, content: "Een volwassene die je niet kent, stuurt je een bericht met veel complimenten en zegt dat je 'heel speciaal bent.'", safe: false},
  {points: 1, content: "Je vertelt een volwassene online dat je onder de 18 bent. De volwassene wordt boos en zegt dat je gelijk moet stoppen met de chatapp gebruiken.", safe: true},
  {points: 2, content: "Je wordt benaderd door P Diddy hemzelf. Hij zegt dat als je niet direct met hem meegaat dat de consequenties heel erg zullen zijn.", safe: false},
];

let // LET VALUES
s_count = 0,
card_game_active = true;

// Functions

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


class Player {
  constructor(username, points) {
    this.username = username;
    this.points = points;
    this.level = 0;
    this.inventory = [];
    this.badges = {};
  }

  inv_add(items) {
    items.forEach(element => {
      this.inventory.push(element);
      console.log(this.inventory);
    });
  }

  item_use(item) {

  }

  points_upd(amount) {
    if ((this.points + amount) > 0)
      this.points += amount;
      setCookie("points", this.points, 10);

      if (document.URL.includes("cards.html")) {
        document.querySelector("#points").innerHTML = `Punten: ${this.points}`;
      }
    }
  }

class Shop {
  constructor(items) {
    this.items = items;
  }

  buy(player, item, amount) {
    if (this.items[item].stock >= amount) {
      if (player.points >= this.items[item].cost) {
        this.items[item].stock -= amount;
        player.points_upd(-(this.items[item].cost * amount));
        player.inv_add([item]);
      }
    }
  }

  setup() {
    const shop_container = document.querySelector(".shop-container");

    for (const k in this.items) {
      const 
      shop_div = document.createElement("div"),
      product_cost = document.createElement("cost"),
      product_img = document.createElement("img"),
      product_div = document.createElement("div"),
      product_name = document.createElement("h2"),
      product_desc = document.createElement("p");

      shop_div.addEventListener("click", function() {
        shop.buy(player, k, 1);
      });

      shop_div.classList.add("product");
      shop_container.appendChild(shop_div);

      product_cost.innerHTML = `Punten: ${this.items[k].cost}`;
      product_cost.classList.add("product-cost");
      shop_div.appendChild(product_cost);

      product_img.src = this.items[k].img;
      product_img.classList.add("product-image");
      shop_div.appendChild(product_img);
      
      product_div.classList.add("product-description");
      shop_div.appendChild(product_div);
      
      product_name.innerHTML = k;
      product_div.appendChild(product_name);
      
      product_desc.innerHTML = this.items[k].description;
      product_div.appendChild(product_desc);
    }

    /*

    <div class="product">
     <img src="/images/phone.jpeg" alt="Telefoon" class="product-image">
     <div class="product-description">
    <h2>Telefoon</h2>
    <p>Gebruik om politie te bellen en de tijd van een vraag te verlengen. Zorg ervoor dat je altijd bereikbaar bent!</p>
    <button class="buy-button" onclick="buyProduct('Telefoon')">Koop Telefoon</button>
      </div>
    </div>

    */
  }

}

const player = new Player("test123", 1000/* getCookie("points")*/);

function initializeGame() {
  s_title.innerHTML = `Situatie ${s_count + 1}`;
  s_txt.innerHTML = situaties[s_count].content;
  for (const k in cards) {
    const degArray = [-90, 90, 45, -45];
    cards[k].addEventListener("click", function() {
      if (s_count < situaties.length) {
        if (card_game_active === true) {
          if ((situaties[s_count].safe === true && k === "safe") || 
          (situaties[s_count].safe === false && k === "unsafe")) {
            player.points_upd(situaties[s_count].points);
            trueSound.play();
          } else {
            player.points_upd(-1);
            falseSound.play();
          }
          cards[k].animate(
            [
              { transform: "rotate(0) scale(1)" },
              { transform: `rotate(${degArray[Math.floor(Math.random() * degArray.length)]}deg) scale(0)` },
            ],
            {
              duration: 500,
              iterations: 1,
            } 
          );
          setTimeout(() => {
            s_count++;
            updateSituation();
          }, 500);
        }
      } else {
        card_game_active = false;
      }
    });
  }
}

function updateSituation() {
  if (s_count < situaties.length) {
    s_title.innerHTML = `Situatie ${s_count + 1}`;
    s_txt.innerHTML = situaties[s_count].content;
  }
}

const shop = new Shop(
  {
    ["Anti-Baby Olie"]: {
      stock: 4,
      max_use: 1,
      cost: 2,
      img: '../assets/antibabyolie.jpg',
      description: "Hiermee kan je de baby olie die naar je toe wordt gegooid ontwijken."
    },
  
    ["Telefoon"]: {
      stock: 1,
      max_use: 2,
      cost: 10,
      img: '../assets/phone.jpeg',
      description: "Bel de politie om extra tijd te krijgen in een situatie."
    },
  }
);

if (document.URL.includes("Shop.html")) {
  shop.setup();
} else if (document.URL.includes("cards.html")) {
  initializeGame();
}
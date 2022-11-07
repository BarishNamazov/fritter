<template>
  <router-link v-if="username !== '[comment deleted]'" class="container" :to="`/user/${username}`">
    <span class="avatar" :style="{backgroundColor: genProperties.shapeColor}">
      <BigHead 
        v-if="genProperties" 
        shape="circle" 
        :accessory="genProperties.accessory" :body="genProperties.body" :clothing="genProperties.clothing" 
        :clothingColor="genProperties.clothingColor" 
        :eyebrows="genProperties.eyebrows" 
        :eyes="genProperties.eyes" 
        :facialHair="genProperties.facialHair" 
        :facialHairColor="genProperties.facialHairColor" 
        :graphic="genProperties.graphic" 
        :hair="genProperties.hair" 
        :hairColor="genProperties.hairColor" 
        :hat="genProperties.hat" 
        :hatColor="genProperties.hatColor" 
        :lashes="genProperties.lashes" 
        :lipColor="genProperties.lipColor" 
        :mouth="genProperties.mouth" 
        :shapeColor="genProperties.shapeColor" 
        :skinTone="genProperties.skinTone"
      />
    </span>
    <span>{{ username }}</span>
  </router-link>
  <div v-else class="container">
    <span class="avatar"><img src="https://www.svgrepo.com/show/192510/trash.svg" /> </span>
    <span>{{ username }}</span>
  </div>
</template>

<script>
import { properties, BigHead } from "@/components/BigHeads";

function randomGenerator(seed) {
  return function () {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };
}

const TSH = s=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return h^h>>>9}

export default {
  name: "UsernameComponent",
  components: {
    BigHead,
  },
  props: {
    username: {
      type: String,
      required: true,
    }
  },
  computed: {
    hash: function () {
      return TSH(this.username.toLowerCase());
    },
    genProperties: function () {
      return this.getAllProperties();
    }
  },
  methods: {
    randomProperty: function (obj, random) {
      var keys = Object.keys(obj);
      return keys[(keys.length * random()) << 0];
    },
    getAllProperties: function () {
      const res = {};
      const random = randomGenerator(TSH(this.username))
      for (const [key, value] of Object.entries(properties)) {
        res[key] = this.randomProperty(value.map, random);
      }
      return res;
    },
  }
}
</script>

<style scoped>
.container {
  padding: 0.2em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5em;
}

.avatar, svg, img {
  /* border: 1px solid black; */
  /* border-radius: 50%; */
  height: 3em;
  width: 3em;
  border-radius: 50%;
}

a {
  text-decoration: none;
  color: inherit;
}

a:hover {
  background-color: var(--hover-color);
  border-radius: var(--border-radius-large);
}
</style>
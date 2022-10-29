<template>
  <div>
    <div id="prizePanel">
      <div class="form-group">
        <label>Ссылка на пост</label>
        <input v-model="postLink" type="Text" class="form-control" placeholder="Например: https://dtf.ru/u/52199-traktirshchik/1416749-bystryy-rozygrysh-outer-wilds-i-aer-memories-of-old">
      </div>
      <div v-if="noWord == false" class="form-group">
        <label>Введите слово, которое будем искать</label>
        <input v-model="searchWord" type="text" class="form-control" placeholder="Например: Учавствую">
      </div>
      <div class="checkbox">
        <label>
          <input v-model="noWord" type="checkbox"> Без слова, просто случайный победитель
        </label>
      </div>
      <div class="form-group">
        <label>Сколько победителей</label>
        <select v-model="prizeCount" class="form-control">
          <option value="1">Один</option>
          <option value="2">Два</option>
          <option value="3">Три</option>
          <option value="4">Четыре</option>
          <option value="5">Пять</option>
          <option value="6">Шесть</option>
          <option value="7">Семь</option>
          <option value="8">Восемь</option>
        </select>
      </div>
      <div id="settings">
        <div class="checkbox">
          <label>
            <input v-model="onlyMainComment" type="checkbox"> Не учитывать ответы на комментарии
          </label>
        </div>
        <div class="checkbox">
          <label>
            <input v-model="nonFreeze" type="checkbox"> Исключить замороженные аккаунты
          </label>
        </div>
        <div class="checkbox">
          <label>
            <input v-model="withMedia" type="checkbox"> Должно быть вложение <i>(например картинка)</i>
          </label>
        </div>
      </div>
     
      <div class="form-actions">
        <button @click="foundPrizer()" id="foundPrize" class="btn btn-form btn-primary">Определить победителя</button>
      </div>
      <div style="clear: both; float: none;"></div>
    </div>

    <div v-if="comment_list.length > 0">
      <p id="desc">
        <b>Всего комментариев:</b> {{ totalComments }} | <b>Подошло под настройки: </b> {{ neededComments }}
      </p>
      
      <hr v-if="random_result.length > 0">
      <h4 v-if="random_result.length > 0" id="desc">Победители</h4>
      <table v-if="random_result.length > 0" class="table-striped">
        <thead>
          <tr>
            <th>id</th>
            <th>Пользователь</th>
            <th>Комментарий</th>
            <th>Ответ на комментарйи</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="res in random_result" :key="res" class="file_arq" :style="random_result.includes(res) ? 'background-color: #a0ffa4;' : ''">
            <td><a :href="'https://dtf.ru/' + postId + '?comment=' + comment_list[res].commentId" target="_blank">{{ res }}</a></td>
            <td><a :href="'https://dtf.ru/u/' + comment_list[res].authorId" target="_blank">{{ comment_list[res].authorName }}</a></td>
            <td>{{ comment_list[res].text }}</td>
            <td v-if="comment_list[res].answered == true">Да</td>
            <td v-else>Нет</td>
          </tr>
        </tbody>
      </table>
      <hr>

      <h4 id="desc">Подходящие комментарии</h4>
      <table class="table-striped">
        <thead>
          <tr>
            <th>id</th>
            <th>Пользователь</th>
            <th>Комментарий</th>
            <th>Ответ на комментарйи</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(comment, id) in comment_list" :key="id" class="file_arq" :style="random_result.includes(id) ? 'background-color: #a0ffa4;' : ''">
            <td><a :href="'https://dtf.ru/' + postId + '?comment=' + comment.commentId" target="_blank">{{ id }}</a></td>
            <td><a :href="'https://dtf.ru/u/' + comment.authorId" target="_blank">{{ comment.authorName }}</a></td>
            <td>{{ comment.text }}</td>
            <td v-if="comment.answered == true">Да</td>
            <td v-else>Нет</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HelloWorld',
  data(){
    return{
      postId: 0,
      postLink: '',
      searchWord: '',
      prizeCount: 1,
      noWord: false,
      onlyMainComment: false,
      nonFreeze: false,
      withMedia: false,
      comment_list: [],
      totalComments: 0,
      neededComments: 0,
      random_result: [],
    }
  },
  methods:{
    foundPrizer(){
      // Обнуляем массив после каждого клика
      this.comment_list = [];
      this.totalComments = 0;
      this.neededComments = 0;
      this.random_result = [];

      if (this.postLink) {
        this.postId = this.postLink.split( '/' )[5].split( '-' )[0];

        axios.get('https://api.dtf.ru/v1.8/entry/'+ this.postId +'/comments/popular')
        .then((response) => {
          const comments = response.data.result;
          this.totalComments = comments.length;

          comments.map((value) => {
            // Проверка на замороженный аккаунт
            if (this.nonFreeze && value.author.name == 'Аккаунт заморожен') {
              return false;
            }

            // Проверка на ответы
            if (this.onlyMainComment && value.replyTo !== 0) {
              return false;
            }

            // Проверка на медиа
            if (this.withMedia && value.media.length == 0) {
              return false;
            }

            if (value.text.includes(this.searchWord)) {
              this.neededComments += 1;
              const comment = {
                'authorName': value.author.name,
                'authorId': value.author.id,
                'commentId': value.id,
                'text': value.text,
                'answered': value.replyTo == 0 ? false : true,
              };

              this.comment_list.push(comment);
            }
          }).filter(Boolean);

          for (let step = 0; step < this.prizeCount; step++) {
            const rnd = this.getRandomInt(this.totalComments);
            if (!this.random_result.includes(rnd)) {
              this.random_result.push(rnd);
            }
          }
        })
        .catch(function () {
          alert('Не моуг получить пост, возможно он находится в закрытом блоге или бы удалён.');
        });
      } else {
        alert('Вставьте ссылку на пост');
      }
    },
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#prizePanel {
  padding: 20px;
}

#foundPrize {
  float: right;
  margin-bottom: 30px;
}

#settings {
  border-top: 1px solid #dddddd;
  padding-top: 5px;
  margin-top: 15px;
}

#desc {
  margin-left: 10px;
}
</style>

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
        <div class="checkbox">
          <label>
            <input v-model="withLike" type="checkbox"> Должен быть лайк посту
          </label>
        </div>
        <p v-if="withLike">
          <b>Перейдите по ссылке</b>
            <a :href="'https://dtf.ru/vote/get_likers?id=' + getPostId() + '&type=1&mode=raw'" target="_blank">
              https://dtf.ru/vote/get_likers
            </a>
          и скопируйте содержимое, после этого вставьте весь текст в поле ниже:<br>
          <textarea v-model="likers" id="likers"></textarea>
        </p>
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
      
      <div v-if="end">
        <hr>
        <h4 id="desc">Победители</h4>
        <table class="table-striped">
          <thead>
            <tr>
              <th>id</th>
              <th>Пользователь</th>
              <th>Комментарий</th>
              <th>Ответ на комментарйи</th>
            </tr>
          </thead>
          <tbody v-if="end">
            <tr v-for="res in random_result" :key="res" class="file_arq" :style="random_result.includes(res) ? 'background-color: #a0ffa4;' : ''">
              <td><a v-if="comment_list[res].commentId" :href="'https://dtf.ru/' + postId + '?comment=' + comment_list[res].commentId" target="_blank">{{ res }}</a></td>
              <td><a :href="'https://dtf.ru/u/' + comment_list[res].authorId" target="_blank">{{ comment_list[res].authorName }}</a></td>
              <td><a :href="'https://dtf.ru/' + postId + '?comment=' + comment_list[res].commentId" target="_blank">{{ comment_list[res].text }}</a></td>
              <td v-if="comment_list[res].answered == true">Да</td>
              <td v-else>Нет</td>
            </tr>
          </tbody>
        </table>
        <hr>
      </div>
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
        <tbody v-if="random_result.length > 0">
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
      withLike: false,
      comment_list: [],
      totalComments: 0,
      neededComments: 0,
      random_result: [],
      likers: '',
      end: false,
    }
  },
  methods:{
    foundPrizer(){
      // Обнуляем массив после каждого клика
      this.comment_list = [];
      this.totalComments = 0;
      this.neededComments = 0;
      this.random_result = [];
      this.end = false;

      if (this.postLink) {
        this.postId = this.getPostId();

        axios.get('https://api.dtf.ru/v1.8/entry/'+ this.postId +'/comments/popular')
        .then((response) => {
          const comments = response.data.result;
          console.log(comments);
          this.totalComments = comments.length;
          const user_list = [];
          const postLikes = [];

          if (this.likers !== '') {
          const likes = JSON.parse(this.likers).data.likers;
            Object.keys(likes).forEach((key) => {
              if (likes[key].sign == 1) {
                postLikes.push(parseInt(key));
              }
            });
          }

          comments.forEach((value) => {
            // Проверка на замороженный аккаунт
            if (this.nonFreeze && value.author.name == 'Аккаунт заморожен') {
              return;
            }

            // Проверка на ответы
            if (this.onlyMainComment && value.replyTo !== 0) {
              return;
            }

            // Проверка на медиа
            if (this.withMedia && value.media.length == 0) {
              return;
            }

            if (this.withLike) {
              if (!postLikes.includes(value.author.id)) {
                return;
              }
            }

            const commentText = value.text.toLowerCase();
            if (commentText.includes(this.searchWord.toLowerCase())) {

              if (value.author.id == -1) {
                value.author.name = '[Скрытый пользователь]';
              }

              const comment = {
                'authorName': value.author.name,
                'authorId': value.author.id,
                'commentId': value.id,
                'text': value.text,
                'answered': value.replyTo == 0 ? false : true,
              };

              if (user_list.includes( value.author.id)) {
                user_list.splice(user_list.indexOf( value.author.id), 1);
                user_list.push(value.author.id);
              } else {
                this.neededComments += 1;
                user_list.push(value.author.id);
                this.comment_list.push(comment);
              }
            }
          });

          for (let step = 0; step < this.prizeCount; step++) {
            const rnd = this.getRandomInt(this.neededComments);
            if (!this.random_result.includes(rnd)) {
              this.random_result.push(rnd);
            }

            this.end = true;
          }
        })
        .catch(function () {
          alert('Не моуг получить пост, возможно он находится в закрытом блоге или бы удалён.');
        });
      } else {
        alert('Вставьте ссылку на пост');
      }
    },
    getPostId() {
      if (this.postLink.split( '/' )[5]) {
          return  this.postLink.split( '/' )[5].split( '-' )[0];
        } else {
          return this.postLink.split( '/' )[4].split( '-' )[0];
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

#likers {
  width: 100%;
  height: 120px;
  margin-top: 20px;
  border-color: #dddddd;
}
</style>

<template>
  <div class="main">
    <div id="prizePanel">
      <div class="form-group">
        <label>Ссылка на пост</label>
        <input v-model="postLink" type="Text" class="form-control" placeholder="Например: https://dtf.ru/u/52199-traktirshchik/1416749-bystryy-rozygrysh-outer-wilds-i-aer-memories-of-old">
      </div>
      <div v-if="noWord == false" class="form-group">
        <label>Введите слово, которое будем искать</label>
        <input v-model="searchWord" type="text" class="form-control" placeholder="Например: Участвую">
      </div>
      <div class="checkbox">
        <label>
          <input v-model="noWord" type="checkbox"> Без слова, просто случайный победитель
        </label>
      </div>
      <div class="form-group">
        <label>Сколько победителей</label>
        <input type="number" v-model="prizeCount" class="form-control"/>
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
            <input v-model="withLike" type="checkbox"> Должен быть лайк посту (любая реакция)
          </label>
        </div>
      </div>
      
      <div class="form-actions">
        <button @click="foundPrizer()" id="foundPrize" class="btn btn-form btn-primary">{{ !loading ? 'Определить победителя' : 'Определяем победителя...' }}</button>
        <br>
      </div>
      <div style="clear: both; float: none;"></div>
      <a v-if="!end" href="https://dtf.ru/u/52199" style="float: right; margin-right: 10px;" target="_blank">Донаты и вопросы сюда</a>
      <div style="clear: both; float: none;"></div>

    </div>

    <div v-if="comment_list.length > 0">
      <p id="desc">
        <b>Всего комментариев:</b> {{ totalComments }} | <b>Подошло под настройки: </b> {{ neededComments }} <i>(Мы исключили {{ repeatedComments }} комментариев от повторных авторов)</i>
      </p>
      
      <div v-if="end">
        <div class="row align-items-start" style="margin: 0;">
            <div class="col">
              <PrizeWheel ref="prizeWheel" :comments="comment_list" @get="getWinner"/>
            </div>
            <div class="col">
              <h4 id="desc">Победители</h4>
              <small v-if="end">Шанс выйгрыша - {{ chance }}%</small>
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
                      <td class="comment-winner"><a :href="'https://dtf.ru/' + postId + '?comment=' + comment_list[res].commentId" target="_blank">{{ comment_list[res].text }}</a></td>
                      <td v-if="comment_list[res].answered == true">Да</td>
                      <td v-else>Нет</td>
                    </tr>
                  </tbody>
                </table>
                <p v-if="resultID && end" class="link-result">
                  <b>Ссылка на результаты розыгрыша:</b> <a :href="'/history/' + resultID">/history/{{ resultID }}</a>
                </p>
            </div>
          </div>
        
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
            <td>
              <img class="avatar" v-if="comment.avatar" :src="'data:image/png;base64,' + comment.avatar">
              <img class="avatar" v-else src="data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAKAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAgK/8QAJBAAAAQFAwUAAAAAAAAAAAAAAQMEEQACBQYHFSExCBITQYH/xAAVAQEBAAAAAAAAAAAAAAAAAAAFCP/EAB0RAAIDAQADAQAAAAAAAAAAAAEDAgQFBhEhI0L/2gAMAwEAAhEDEQA/ANP+bcqdVtr5zt2ycaWJSa1YVy6Dp1bOoi1eUSBZsk1zDV6uSsJTUkU5Ym7KS5OxGBB6XznzzSxeIOwOztu3D+242+QhBlesxDbTJ2n2I2Ghi1NIMK0QD8kgAERJJPsn0IR/JMqK3+io7WZzNCpzGJhPwc2dG9pZa3wudHYlJYjo6xa1kDZilK4+FRjEuZaf5EXwSj//2Q==">
              <a :href="'https://dtf.ru/u/' + comment.authorId" target="_blank">{{ comment.authorName }}</a>
            </td>
            <td class="comment">{{ comment.text }}</td>
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
import PrizeWheel from './components/Prize-Wheel.vue'

export default {
  name: 'PrizePanel',
  components: {
    PrizeWheel
  },
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
      repeatedComments: 0,
      random_result: [],
      postLikes: [],
      likers: '',
      end: false,
      spinCalls: 0,
      loading: false,
      resultID: 0,
      chance: 0
    }
  },
  methods:{
    async foundPrizer(){
      // Обнуляем массив после каждого клика
      this.comment_list = [];
      this.totalComments = 0;
      this.neededComments = 0;
      this.repeatedComments = 0;
      this.random_result = [];
      this.end = false;
      this.loading = true;

      if (this.postLink) {
        this.postId = this.getPostId();

        if (this.withLike) {
          await this.getPostLike();
        }

        await axios.get('https://api.dtf.ru/v2.31/comments?contentId='+ this.postId +'&sorting=date')
        .then((response) => {
          const comments = response.data.result.items;
          this.totalComments = comments.length;
          const user_list = [];

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
              if (!this.checkUserIdExists(this.postLikes, value.author.id)) {
                return;
              }
            }

            const commentText = value.text.toLowerCase();
            if (commentText.includes(this.searchWord.toLowerCase())) {

              if (value.author.id == -1) {
                value.author.name = '[Скрытый пользователь]';
              }

              const randomValue = Math.floor(Math.random() * 0x1000000);

              const comment = {
                'authorName': value.author.name,
                'authorId': value.author.id,
                'commentId': value.id,
                'text': value.text,
                'answered': value.replyTo == 0 ? false : true,
                'avatar': value.author.avatar.data.base64preview,
                'color': '#' + randomValue.toString(16).padStart(6, '0')
              };

              if (user_list.includes( value.author.id)) {
                user_list.splice(user_list.indexOf( value.author.id), 1);
                user_list.push(value.author.id);
                this.repeatedComments += 1;
              } else {
                this.neededComments += 1;
                user_list.push(value.author.id);
                this.comment_list.push(comment);
              }
            }
          });

          this.end = true;
          this.loading = false;
          this.chance = this.calculateChance(this.comment_list, this.prizeCount);
          setTimeout(() => {this.$refs.prizeWheel.handleSpinClick();}, 1000);
          this.spinCalls += 1;
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
    checkUserIdExists(reactionsArray, userId) {
      return reactionsArray.some(reaction => 
        reaction.user && reaction.user.id === userId
      );
    },
    async getPostLike() {
      await axios.get('https://dtfpass.ru/likes.php?id='+ this.postId)
      .then((response) => {

        this.postLikes = response.data.result.reactions;
        return response.data.result.reactions;
      }).catch(function () {
        alert('Ошибка получения лайков, возможно слишком много запросов, попробуйте позже.');
      });
    },
    async getWinner(n) {
      if (!this.random_result.includes(n)) {
        this.random_result.push(n);
      } else {
        this.$refs.prizeWheel.handleSpinClick();
      }

      if (this.spinCalls < this.prizeCount) {
        setTimeout(() => {
          this.$refs.prizeWheel.handleSpinClick();
          this.spinCalls += 1;
        }, 1000);
      } else {
        await axios.post('https://dtfpass.ru/save.php', { comment_list: JSON.stringify(this.comment_list), random_result: JSON.stringify(this.random_result), postLink: JSON.stringify(this.postLink), searchWord: this.searchWord })
          .then(response => {
            this.resultID = response.data.insert_id;
          })
          .catch(error => {
            console.error('Error saving data to MySQL:', error);
          });
      }
    },
    calculateChance(users, selectNumber) {
        const totalUsers = users.length;
        if (totalUsers === 0 || selectNumber < 1 || selectNumber > 99) {
            return 0;
        }
        const ch = (selectNumber / totalUsers) * 100;
        return ch.toFixed(2);
    }
  }
}
</script>

<style scoped>

.main {
  overflow: auto;
  display: block;
  height: 95%;
  width: 95%;
  margin: 10px auto;
  border: 1px solid #dbdbdb;
}

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

.comment {
  max-width: 600px;
}

.comment-winner {
  max-width: 200px;
}

.avatar {
  margin-right: 5px;
  margin-bottom: 2px;
}

.link-result {
  margin-top: 20px;
}
</style>
<template>
  <div class="main">
    <div id="prizePanel">
      <div class="form-group">
        <p>Дата розыгрыша: <b> {{ date }} </b></p>
      </div>
      <div class="form-group">
        <label>Ссылка на пост</label>
        <input v-model="postLink" type="Text" class="form-control" disabled>
      </div>
      <div v-if="searchWord" class="form-group">
        <label>Слово</label>
        <input v-model="searchWord" type="text" class="form-control" disabled>
      </div>
      <div v-else class="checkbox">
        <label>
          <input checked disabled type="checkbox"> Без слова, просто случайный победитель
        </label>
      </div>


    <div>
      <div>
        <div class="row align-items-start" style="margin: 0;">
              <h4 id="desc">Победители (Шанс выйгрыша - {{ chance }}%) </h4>
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
                    <tr v-for="res in random_result" :key="res" class="file_arq" :style="random_result.includes(res) ? 'background-color: #a0ffa4;' : ''">
                      <td><a v-if="comment_list[res].commentId" :href="'https://dtf.ru/' + postId + '?comment=' + comment_list[res].commentId" target="_blank">{{ res }}</a></td>
                      <td><a :href="'https://dtf.ru/u/' + comment_list[res].authorId" target="_blank">{{ comment_list[res].authorName }}</a></td>
                      <td class="comment-winner"><a :href="'https://dtf.ru/' + postId + '?comment=' + comment_list[res].commentId" target="_blank">{{ comment_list[res].text }}</a></td>
                      <td v-if="comment_list[res].answered == true">Да</td>
                      <td v-else>Нет</td>
                    </tr>
                  </tbody>
                </table>
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
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HistoryPage',
  data(){
    return{
      postLink: '',
      searchWord: '',
      comment_list: [],
      random_result: [],
      date: '',
      chance: 0,
    }
  },
  async mounted() {
    await axios.get('https://dtfpass.ru/history.php?id=' + this.$route.params.id)
      .then((response) => {
        this.comment_list = JSON.parse(response.data.comment_list);
        this.postLink = JSON.parse(response.data.postLink);
        this.random_result = JSON.parse(response.data.random_result);
        this.searchWord = response.data.word;
        this.date = response.data.date;
        this.postId = this.getPostId();
        this.chance = this.calculateChance(this.comment_list, this.random_result.length);
      }).catch(function () {
        alert('Ошибка получения розыгрыша.');
      });
  },
  methods:{
    getPostId() {
      if (this.postLink.split( '/' )[5]) {
          return this.postLink.split( '/' )[5].split( '-' )[0];
        } else {
          return this.postLink.split( '/' )[4].split( '-' )[0];
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
</style>
<template>
    <div class="pane">
      <div v-if="!activeSearch">
        <div class="form-group">
          <label>Ссылка на профиль</label>
          <input v-model="profileLink" type="Text" class="form-control" placeholder="Например: https://dtf.ru/u/52199-traktirshchik/">
        </div>
        <button @click="getResult()" id="foundPrize" class="btn btn-form btn-primary">Получить итоги</button>
      </div>

      <div v-if="activeSearch" class="row mt-5">
        <div class="col-12 col-xs-12 col-sm-5 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Аватар</h1>
            </header>
            <div class="card-body text-center">
              <img :src="user.avatar" class="img-fluid rounded-start">
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Имя профиля</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ user.name }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Всего постов</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ user.totalPosts }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Всего коментариев</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ user.totalComments }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Постов в этом году</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ posts.length }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Комментариев в этом году</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ comments.total }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Комментариев под постами</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ total.comments }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Просмотров в постах</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ total.hits }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Доавлений в закладки ваших постов</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ total.favorites }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Репостов ваших постов</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ total.reposts }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Лайков на комментариях</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ comments.likes }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Ответил на X комментариев</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ comments.reply }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Медиа в комменатриях</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ comments.media }}</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Полученно достижений</h1>
            </header>
            <div class="card-body text-center">
              <h2>{{ activeAchivements }} / 18</h2>
            </div>
          </div>
        </div>
        <div v-if="hogwards" class="col-12 col-xs-12 col-sm-6 col-md-4 col-lg-3 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Поучавствовал в Хогвартс эвенте</h1>
            </header>
            <div class="card-body text-center">
              <h2>Да</h2>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Достижения</h1>
            </header>
            <div class="card-body" style="overflow: scroll;">
              <table class="table-striped">
                <thead>
                  <tr>
                    <th>Иконка</th>
                    <th>Название</th>
                    <th>Описание</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="achievement in achivements" :key="achievement.id" :class="achievement.active ? 'bg-success' : ''">
                    <td><img :src="achievement.image" width="40px"></td>
                    <td>{{ achievement.title }}</td>
                    <td>{{ achievement.description }}</td>
                    <td>{{ achievement.active ? 'Получено' : 'Не получено' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Статистика постов по месяцам</h1>
            </header>
            <div class="card-body" style="overflow: scroll;">
              <v-table :data="month_data">
                <thead slot="head">
                    <v-th sortKey="m">Месяц</v-th>
                    <v-th sortKey="posts">Кол-во постов</v-th>
                    <v-th sortKey="comments">Комментариев под постами</v-th>
                    <v-th sortKey="favourites">Добавлений в избранное</v-th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="mdata in displayData" :key="mdata.m">
                      <td>{{ mdata.m + 1 }}</td>
                      <td>{{ mdata.posts }}</td>
                      <td>{{ mdata.comments }}</td>
                      <td>{{ mdata.favourites }}</td>
                    </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Список постов</h1>
            </header>
            <div class="card-body" style="overflow: scroll;">
              <v-table :data="posts">
                <thead slot="head">
                    <v-th sortKey="title">Название поста</v-th>
                    <v-th sortKey="likes">Лайков</v-th>
                    <v-th sortKey="comments">Комментариев</v-th>
                    <v-th sortKey="hits">Просмотров</v-th>
                    <v-th sortKey="reposts">Репостов</v-th>
                    <v-th sortKey="favourites">Закладки</v-th>
                    <v-th sortKey="blocks">Блоков (Длина)</v-th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="mdata in displayData" :key="mdata.m">
                      <td><a :href="mdata.url" target="_blank">{{ mdata.title ? mdata.title : 'Нет названия' }}</a></td>
                      <td>{{ mdata.likes }}</td>
                      <td>{{ mdata.comments }}</td>
                      <td>{{ mdata.hits }}</td>
                      <td>{{ mdata.reposts }}</td>
                      <td>{{ mdata.favourites }}</td>
                      <td>{{ mdata.blocks }}</td>
                    </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </div>
        <div class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Публикация постов в подсайты</h1>
            </header>
            <div class="card-body" style="overflow: scroll;">
              <table class="table-striped">
                <thead>
                  <tr>
                    <th>Название подсайта</th>
                    <th>Кол-во постов</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(sd, i) in subsite_data" :key="i">
                    <td>{{ sd.name }}</td>
                    <td>{{ sd.count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div v-if="stopComments" class="col-12 col-xs-12 col-sm-12 col-md-12 col-lg-12 mb-2">
          <div class="card">
            <header class="toolbar toolbar-header">
              <h1 class="title mt-1">Топ комментариев</h1>
            </header>
            <div class="card-body" style="overflow: scroll;">
              <v-table :data="comments.data">
                <thead slot="head">
                    <v-th sortKey="id">#</v-th>
                    <v-th sortKey="likes">Лайков</v-th>
                </thead>
                <tbody slot="body" slot-scope="{displayData}">
                    <tr v-for="mdata in displayData" :key="mdata.m">
                      <td><a :href="mdata.url" target="_blank">{{ mdata.id }}</a></td>
                      <td>{{ mdata.likes }}</td>
                    </tr>
                </tbody>
              </v-table>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StatisticPanel',
  data(){
    return{
      profileLink: '',
      activeSearch: false,
      user: {
        id: 0,
        name: '',
        avatar: '',
        totalPosts: 0,
        totalComments: 0,
      },
      total: {
        comments: 0,
        hits: 0,
        likes: 0,
        favorites: 0,
        reposts: 0,
      },
      fields: [
        {
          key: 'title',
          label: 'Название',
          sortable: true
        },
        {
          key: 'hits',
          label: 'Просмотров',
          sortable: true
        },
        {
          key: 'likes',
          label: 'Оценка',
          sortable: true
        },
        {
          key: 'comments',
          label: 'Комментариев',
          sortable: true
        },
        {
          key: 'favourites',
          label: 'Добавлений в избранное',
          sortable: true
        },
        {
          key: 'blocks',
          label: 'Блоков',
          sortable: true
        }
      ],
      comment_fields: [
        {
          key: 'url',
          label: 'Комментарий',
          sortable: true
        },
        {
          key: 'likes',
          label: 'Оценок',
          sortable: true
        }
      ],
      posts: [],
      comments: {
        data: [],
        total: 0,
        likes: 0,
        reply: 0,
        media: 0,
        subsites: [],
      },
      month_data: [],
      subsite_data: [],
      loaded: false,
      time1: null,
      stopComments: false,
      stopPosts: false,
      totalRequests: 0,
      totalLongs: 0,
      activeAchivements: 0,
      achivements: [
        {
          id: 0,
          image: 'https://stat.dtfpass.ru/achivements/1.jpeg',
          title: 'Начинающий щитпостер',
          description: 'Опубликуйте 50 постов',
          active: false
        },
        {
          id: 1,
          image: 'https://stat.dtfpass.ru/achivements/2.jpeg',
          title: 'Продвинутый щитпостер',
          description: 'Опубликуйте 150 постов',
          active: false
        },
        {
          id: 2,
          image: 'https://stat.dtfpass.ru/achivements/3.png',
          title: 'Мега щитпостер',
          description: 'Опубликуйте 300 постов',
          active: false
        },
        {
          id: 3,
          image: 'https://stat.dtfpass.ru/achivements/4.jpeg',
          title: 'Бла',
          description: 'Напишете 250 комментариев',
          active: false
        },
        {
          id: 4,
          image: 'https://stat.dtfpass.ru/achivements/5.jpeg',
          title: 'Бла-бла',
          description: 'Напишете 500 комментариев',
          active: false
        },
        {
          id: 5,
          image: 'https://stat.dtfpass.ru/achivements/6.png',
          title: 'Бла-бла-бла',
          description: 'Напишете 1000 комментариев',
          active: false
        },
        {
          id: 6,
          image: 'https://stat.dtfpass.ru/achivements/7.jpeg',
          title: 'Балабол',
          description: 'Напишете 2000 комментариев',
          active: false
        },
        {
          id: 7,
          image: 'https://stat.dtfpass.ru/achivements/8.jpeg',
          title: 'Давай поговорим',
          description: 'Ответьте на 250 комментариев',
          active: false
        },
        {
          id: 8,
          image: 'https://stat.dtfpass.ru/achivements/9.jpeg',
          title: 'Слушай меня',
          description: 'Ответьте на 500 комментариев',
          active: false
        },
        {
          id: 9,
          image: 'https://stat.dtfpass.ru/achivements/10.jpeg',
          title: 'Мне важно твоё мнение, но',
          description: 'Ответьте на 1000 комментариев',
          active: false
        },
        {
          id: 10,
          image: 'https://stat.dtfpass.ru/achivements/11.jpeg',
          title: 'Популярность - это я',
          description: '1000 лайков на вашем посте',
          active: false
        },
        {
          id: 11,
          image: 'https://stat.dtfpass.ru/achivements/12.jpeg',
          title: 'Это уже топ?',
          description: '1000 лайков на вашем комментарии',
          active: false
        },
        {
          id: 12,
          image: 'https://stat.dtfpass.ru/achivements/13.jpeg',
          title: 'АХАХАХ МЕМАСИКИ',
          description: 'Прикрепите изображение к вашему комментарию 350 раз',
          active: false
        },
        {
          id: 13,
          image: 'https://stat.dtfpass.ru/achivements/14.png',
          title: 'Разносторонняя личность',
          description: 'Создайте посты в 10 разных подсайтах',
          active: false
        },
        {
          id: 14,
          image: 'https://stat.dtfpass.ru/achivements/15.png',
          title: 'Я полезный',
          description: 'Ваши посты добавили в закладки 1000 раз',
          active: false
        },
        {
          id: 15,
          image: 'https://stat.dtfpass.ru/achivements/16.png',
          title: 'Что, какой лонг?',
          description: 'В этом году вы, возможно, написали лонг. (Больше 35 блоков в посте)',
          active: false
        },
        {
          id: 16,
          image: 'https://stat.dtfpass.ru/achivements/17.jpeg',
          title: 'Хороший мальчик',
          description: 'Написать 5 лонгов (Больше 35 блоков в посте)',
          active: false
        },
        {
          id: 17,
          image: 'https://stat.dtfpass.ru/achivements/18.png',
          title: 'Посмотрите на меня',
          description: '100 000 просмотров ваших постов',
          active: false
        },
      ],
      lastSortingPostValue: 0,
      lastPostId: 0,
      lastSortingCommentValue: 0,
      lastCommentId: 0,
      hogwards: false
    }
  },
  methods:{
    getResult(){
      let userId = 0;
      const regex = /\/u\/(\d+)-/;
      const match = this.profileLink.match(regex);

      if (match) {
        userId = match[1];
      } else {
        alert('ID не найден');
      }
      this.user.id = userId;
      axios.get('https://api.dtf.ru/v2.31/subsite?id=' + userId)
        .then((response) => {
          this.user.name = response.data.result.subsite.name;
          this.user.avatar = "https://leonardo.osnova.io/" + response.data.result.subsite.avatar.data.uuid + "/-/scale_crop/100x100/-/format/webp/";
          this.user.totalPosts = response.data.result.subsite.counters.entries;
          this.user.totalComments = response.data.result.subsite.counters.comments;
          this.activeSearch = true;
          this.getPostsStatistic();
          this.getCommentsStatistic();
        })
        .catch(function (error) {
          alert('Ошибка получения данных. Возможно ваш профиль скрыт.');
          console.log(error);
        });
    },
    async getPostsStatistic() {
      let subsite_c = 0;
      let subsites_id = [];
      let postsC = 0;

      for (var l = 0; l <= 11; l++) {
        if (!this.month_data[l]) {
          this.month_data[l] = { m: l, posts: 0, comments: 0, favourites: 0 };
        }
      }

      for (var i = 0; i <= Math.round(this.user.totalPosts / 13); i++) {
        let link = 'https://api.dtf.ru/v2.5/timeline?markdown=false&sorting=new&subsitesIds='+ this.user.id;
        if (i !== 0) {
          link = 'https://api.dtf.ru/v2.5/timeline?markdown=false&sorting=new&lastId=' + this.lastPostId + '&lastSortingValue=' + this.lastSortingPostValue + '&subsitesIds='+ this.user.id;
        }
        await axios.get(link)
          .then((response) => {
            const result = response.data.result;
            this.lastSortingPostValue = result.lastSortingValue;
            this.lastPostId = result.lastId;
            this.totalRequests += 1;

            for (let k = 0; k <= result.items.length; k++) {
              if (result.items[k]) {
                const postDate = new Date(result.items[k].data.date * 1000);
                const postDateYear = postDate.getFullYear();
                if (postDateYear == '2023') {
                  if (result.items[k].data.repostId == null) {
                    this.total.comments += result.items[k].data.counters.comments;
                    this.total.hits += result.items[k].data.counters.hits;
                    this.total.likes += result.items[k].data.likes.counterLikes;
                    this.total.favorites += result.items[k].data.counters.favorites;
                    this.total.reposts += result.items[k].data.counters.reposts;

                    const data = {
                      'id': result.items[k].data.id,
                      'url': 'https://dtf.ru/' + result.items[k].data.id,
                      'title': result.items[k].data.title,
                      'likes': result.items[k].data.likes.counterLikes,
                      'comments': result.items[k].data.counters.comments,
                      'hits': result.items[k].data.counters.hits,
                      'favourites': result.items[k].data.counters.favorites,
                      'reposts': result.items[k].data.counters.reposts,
                      'blocks': result.items[k].data.blocks.length,
                      'date': postDate
                    };
                    this.posts.push(data);

                    if (result.items[k].data.likes.counterLikes >= 1000) { this.achivements[10].active = true; }
                    if (result.items[k].data.blocks.length >= 35) { this.totalLongs += 1; }

                    // Make array for month statisitc
                    if (!this.month_data[postDate.getMonth()]) {
                      this.month_data[postDate.getMonth()] = { m: postDate.getMonth(), posts: 1, comments: result.items[k].data.counters.comments, favourites: result.items[k].data.counters.favorites };
                    } else {
                      this.month_data[postDate.getMonth()].posts += 1;
                      this.month_data[postDate.getMonth()].comments += result.items[k].data.counters.comments;
                      this.month_data[postDate.getMonth()].favourites += result.items[k].data.counters.favorites;
                    }

                    // Check on hogwards
                    if (result.items[k].data.subsite.id == 711176 || result.items[k].data.subsite.id == 711214 || result.items[k].data.subsite.id == 711177 || result.items[k].data.subsite.id == 711175) {
                      this.hogwards = true;
                    }

                    // Make array for subsite statisitc
                    if (!subsites_id[result.items[k].data.subsite.id]) {
                      subsites_id[result.items[k].data.subsite.id] = subsite_c;
                      this.subsite_data[subsite_c] = { count: 1, name: result.items[k].data.subsite.name, id: result.items[k].data.subsite.id };
                      subsite_c += 1;
                    } else {
                      this.subsite_data[subsites_id[result.items[k].data.subsite.id]].count += 1;
                    }
                    postsC += 1;
                  }
                } else {
                  if (postsC > 0) {
                    this.stopPosts = true;
                    break;
                  }
                }
              }
            }
            if (result.items.length == 0) {
               this.stopPosts = true;
            }
          })
          .catch(function (error) {
            alert('Ошибка получения данных. Возможно ваш профиль скрыт.');
            console.log(error);
          });
          if (this.stopPosts) { break; }
      }
      this.subsiteData();
    },
    subsiteData() {
      if (this.subsite_data.length >= 10) { this.achivements[13].active = true; }
      this.subsite_data = this.subsite_data.sort((a,b)=> (a.count < b.count ? 1 : -1));
    },
    async getCommentsStatistic() {
      for (var i = 0; i <= Math.round(this.user.totalComments / 30); i++) {
        let link = 'https://api.dtf.ru/v2.4/comments?sorting=new&subsiteId='+ this.user.id;
        if (i !== 0) {
          link = 'https://api.dtf.ru/v2.4/comments?sorting=new&subsiteId='+ this.user.id +'&lastSortingValue='+ this.lastSortingCommentValue +'&lastId='+ this.lastCommentId;
        }
        await axios.get(link)
          .then((response) => {
            const result = response.data.result;
            this.totalRequests += 1;
            this.lastSortingCommentValue = result.lastSortingValue;
            this.lastCommentId = result.lastId;
            for (let k = 0; k <= result.items.length; k++) {
              if (result.items[k]) {
                const commentDate = new Date(result.items[k].date * 1000);
                const commentDateYear = commentDate.getFullYear();

                if (commentDateYear == '2023') {
                  this.comments.total += 1;
                  this.comments.likes += result.items[k].likes.counterLikes;
                  if (result.items[k].replyTo > 0) {
                    this.comments.reply += 1;
                  }
                  if (result.items[k].media.length > 0) {
                    this.comments.media += 1;
                  }

                  if (result.items[k].likes.counterLikes >= 1000) { this.achivements[11].active = true; }

                  const data = {
                    'id': result.items[k].id,
                    'url': 'https://dtf.ru/' + result.items[k].entry.id + '?comment=' + result.items[k].id,
                    'likes': result.items[k].likes.counterLikes,
                  };
                  this.comments.data.push(data);
                } else {
                    this.topComments();
                    this.stopComments = true;
                    break;
                }
              }
            }
          });
          if (this.stopComments) { this.loaded = true; break; }
      }
      this.checkAchivements();
    },
    topComments() {
      this.comments.data = this.comments.data.sort((a,b)=> (a.likes < b.likes ? 1 : -1));
      this.comments.data = this.comments.data.slice(0, 12);
    },
    checkAchivements() {
      if (this.posts.length >= 50) {
        this.achivements[0].active = true;
      }
      if (this.posts.length >= 150) {
        this.achivements[1].active = true;
      }
      if (this.posts.length >= 300) {
        this.achivements[2].active = true;
      }
      if (this.comments.total >= 250) {
        this.achivements[3].active = true;
      }
      if (this.comments.total >= 500) {
        this.achivements[4].active = true;
      }
      if (this.comments.total >= 1000) {
        this.achivements[5].active = true;
      }
      if (this.comments.total >= 2000) {
        this.achivements[6].active = true;
      }
      if (this.comments.reply >= 250) {
        this.achivements[7].active = true;
      }
      if (this.comments.reply >= 500) {
        this.achivements[8].active = true;
      }
      if (this.comments.reply >= 1000) {
        this.achivements[9].active = true;
      }
      if (this.comments.media >= 350) {
        this.achivements[12].active = true;
      }
      if (this.total.favorites >= 1000) {
        this.achivements[14].active = true;
      }
      if (this.totalLongs >= 1) {
        this.achivements[15].active = true;
      }
      if (this.totalLongs >= 5) {
        this.achivements[16].active = true;
      }
      if (this.total.hits >= 100000) {
        this.achivements[17].active = true;
      }
      for (var a = 0; a <= 17; a++) {
        if (this.achivements[a].active) {
          this.activeAchivements += 1;
        }
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .pane {
    padding: 20px;
  }


</style>

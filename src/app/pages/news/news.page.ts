import {Component, OnInit} from '@angular/core';
import axios from 'axios';
import SparkMD5 from 'spark-md5';

// News data structure.  Follow the definition of MEET-ONE news.https://github.com/meet-one/news-api
interface News {
  id: number;
  title: string;
  content: string;
  img: string;
  url: string;
  show_time: number;
  label_id: number;
  is_important: number;
  label_name: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {

  key: string;
  appid: string;
  showTime: number;

  news: News[];

  constructor() {
  }

  async ngOnInit() {
    this.appid = '18dfc65f206240cc';  // test appid
    this.key = '5cf381436963a92a75b49b4b1ce6e1dc'; // test key
    this.showTime = Date.now();

    this.news = await this.fetchNews(20);
  }

  async fetchNews(pageSize: number): Promise<any> {
    const queryBody = {
      'appid': this.appid,
      'show_time': this.showTime,
      'lang': 'zh',
      'page_size': pageSize,
      'nonce_str': this.randomStr(),
      'sign': ''
    };
    const dataOrigin = `appid=${queryBody.appid}&lang=zh&nonce_str=${queryBody.nonce_str}&page_size=${queryBody.page_size}&show_time=${queryBody.show_time}&key=${this.key}`;
    queryBody.sign = SparkMD5.hash(dataOrigin).toUpperCase();
    const res = await axios.post('https://more.ethte.com/auth/newsflash', queryBody);
    const resp = res.data;

    if (resp.errorcode === 0) {
      console.log(resp.data);
      // reset the showTime for next page fetching.
      this.showTime = resp.data[resp.data.length - 1]['show_time'];
    }
  }

  randomStr(bit: number = 32): string {
    const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f',
      'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
      'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let str = '';
    for (let i = 0; i < bit; i++) {
      str += arr[Math.round(Math.random() * (arr.length - 1))];
    }
    return str;
  }
}

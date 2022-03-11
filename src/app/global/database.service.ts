import { Injectable } from '@angular/core';
import { Database } from '@angular/fire/database';
import { doc, Firestore, setDoc, updateDoc } from "@angular/fire/firestore";
import { collection, getDocs, query, where } from 'firebase/firestore';
import { BannerField, Category, ImageField, Post, Star, TextField } from './global-interfaces';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  constructor(
    private database: Database,
    public firestore: Firestore) { }


  async addUserDataToDb(uid: string, nickname: string, profilePicture: string) {
    const docRef = await setDoc(doc(this.firestore, "users", uid), {
      uid: uid,
      nickname: nickname,
      profilePicture: profilePicture
    });
  }

  async updateProfilePic(uid: string, picture: string) {
    const docRef = await updateDoc(doc(this.firestore, "users", uid), {
      profilePicture: picture
    });
  }

  async addPost(id: string, thumbnail: string, title: string, fields: (TextField | ImageField | BannerField)[], postPrivate: boolean, authorName: string, ratings: Star[], category: Category) {
    const docRef = await setDoc(doc(this.firestore, "posts", id), {
      thumbnail: thumbnail,
      title: title,
      fields: fields,
      postPrivate: postPrivate,
      author: authorName,
      ratings: ratings,
      category: category.name,
      id: id
    });
  }

  async getPosts() {
    const posts = await getDocs(collection(this.firestore, "posts"));
    let localPosts: Post[] = [];

    await posts.forEach((doc) => {
      localPosts.push(doc.data() as Post)
    });

    return await localPosts;
  }

  async getUserName(id: string) {
    const userNameQuery = await query(collection(this.firestore, "users"), where("uid", "==", id));
    const querySnapshot = await getDocs(userNameQuery);
    let username = "";

    await querySnapshot.forEach((doc) => {
      username = doc.data().nickname;
    });

    return username;
  }

  postId() {
    const PUSH_CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz';
    let lastPushTime = 0;
    let lastRandChars: number[] = [];

    return (function () {
      let now = new Date().getTime();
      let duplicateTime = (now === lastPushTime);
      lastPushTime = now;

      let timeStampChars = new Array(8);
      for (var i = 7; i >= 0; i--) {
        timeStampChars[i] = PUSH_CHARS.charAt(now % 64);
        now = Math.floor(now / 64);
      }
      if (now !== 0) throw new Error('We should have converted the entire timestamp.');

      let id = timeStampChars.join('');

      if (!duplicateTime) {
        for (i = 0; i < 12; i++) {
          lastRandChars[i] = Math.floor(Math.random() * 64);
        }
      } else {
        for (i = 11; i >= 0 && lastRandChars[i] === 63; i--) {
          lastRandChars[i] = 0;
        }
        lastRandChars[i]++;
      }
      for (i = 0; i < 12; i++) {
        id += PUSH_CHARS.charAt(lastRandChars[i]);
      }
      if (id.length != 20) throw new Error('Length should be 20.');

      return id
    })();

  }
}

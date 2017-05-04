const config = require("./config");
const GitHubbub = require('./githubbub');
const util = require("util");
const Promise = require('bluebird');
const _ = require("lodash");

function UserWrapper(admin) {

  class User {
    static findById(id) {
      console.log('findById id:', id);
      let db = admin.database();
      return Promise.props({
        account: db.ref(`/accounts/${id}`).once("value").then(snapshot => {
          return snapshot.val();
        }),
        profile: db.ref(`/profiles/${id}`).once("value").then(snapshot => {
          return snapshot.val();
        })
      }).then(data => {
        console.log('findById data:', data);
        let
          account = data.account || {}
        , profile = data.profile || {};

        return new User({
          id: id,
          email: account.email,
          githubToken: account.githubToken,
          updatedAt: account.updatedAt,
          githubCreatedAt: account.githubCreatedAt,
          name: profile.name,
          handle: profile.handle,
          photo: profile.photo
        });
      });
    }

    constructor (attributes) {
      this.id = attributes.id;
      this.email = attributes.email;
      this.githubToken = attributes.githubToken;
      this.updatedAt = attributes.updatedAt;
      this.githubCreatedAt = attributes.githubCreatedAt;
      this.name = attributes.name;
      this.handle = attributes.handle;
      this.photo = attributes.photo;
      this.uid = attributes.uid;
      this.db = admin.database();
      this.github = new GitHubbub(this.githubToken);
    }

    updateProfile() {
      let
        self = this
      , db = this.db
      , accountRef = db.ref(`/accounts/${this.id}`)
      , profileRef = db.ref(`/profiles/${this.id}`);
      console.log('updateProfile', this);
      console.log('account:', `/accounts/${this.id}`)
      console.log('profile:', `/profiles/${this.id}`)
      return this.github.profile().then(data => {
        let newProfile = {
          photo: data.avatar_url,
          name: data.name,
          handle: data.login,
          uid: self.id
        };
        return Promise.all([
          accountRef.update({
            githubCreatedAt: data.created_at,
            updatedAt: admin.database.ServerValue.TIMESTAMP
          }),
          profileRef.update(newProfile)
        ]).then(() => {
          return newProfile;    // for testing
        });
      });
    }
  }

  return User;

}

module.exports = UserWrapper;

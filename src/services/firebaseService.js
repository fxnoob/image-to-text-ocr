// This import loads the firebase namespace along with all its type information.
import { firebase } from "@firebase/app";
// These imports load individual services into the firebase namespace.
import "firebase/auth";
import "firebase/firestore";
import Constants from "../../constants";
import authService from "./authService";
import { urlWithoutQueryParameters } from "./helper";
/**
 * Firebase Utility class
 * https://firebase.google.com/docs/firestore/security/rules-query
 * https://github.com/firebase/quickstart-js/tree/master/auth/chromextension
 *
 * @export
 * @class firebaseServiceClass
 */
class firebaseServiceClass {
  constructor() {
    this.firebase = firebase;
    this.authToken = 0;
    this.init();
  }

  /**
   * Initialization
   * @method
   * @memberOf firebaseServiceClass
   *
   */
  init = () => {
    firebase.initializeApp(Constants.google.firebase.config);
  };

  /**
   * general puropose error handler for firebase
   * @method
   * @memberOf firebaseServiceClass
   *
   */
  errorHandler = async (error) => {
    if (error.code === "auth/invalid-credential") {
      await authService.removeTokenFromCache(this.authToken);
      this.authToken = 0;
    }
  };

  /**
   * get authenticated user data from firebase
   * @method
   * @memberOf firebaseServiceClass
   *
   */
  getUser = async () => {
    this.authToken = await authService.getToken();
    if (this.authToken) {
      // Authorize Firebase with the OAuth Access Token.
      const credential = firebase.auth.GoogleAuthProvider.credential(
        null,
        this.authToken
      );
      return await firebase.auth().signInWithCredential(credential);
    } else {
      throw new Error("AUTH_ERROR");
    }
  };

  /**
   * Save messages of user into firestore
   * @method
   * @memberOf firebaseServiceClass
   */
  saveMessageToFirestore = (channel, details) => {
    console.log("saveMessageToFirestore called", details);
    const { userId, userName, text, profilePicUrl, url } = details;
    // Add a new message entry to the database.
    return firebase
      .firestore()
      .collection(channel)
      .add({
        userId: userId,
        url: urlWithoutQueryParameters(url),
        userName: userName,
        text: text,
        profilePicUrl: profilePicUrl,
        timestamp: this.firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch(function (error) {
        console.error("Error writing new message to database", error);
      });
  };

  /**
   *  Load stored messages from firestore
   *@method
   * @param channel string string
   * @param listenerCallback object object
   *@memberOf firebaseServiceClass
   */

  messageListener = (channel, listenerCallback) => {
    // Create the query to load the last 12 messages and listen for new ones.
    var query = this.firebase
      .firestore()
      .collection(channel)
      .orderBy("timestamp", "desc")
      .limit(1);
    if (listenerCallback) {
      query.onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          listenerCallback(change);
        });
      });
    }
  };
  /**
   *Logout user
   * @method
   * @memberOf firebaseServiceClass
   */
  logout = () => {
    this.firebase.auth().signOut();
  };
}
const firebaseService = new firebaseServiceClass();
export default firebaseService;

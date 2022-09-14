// https://firebase.google.com/docs/web/setup#available-libraries
// For auth using: https://github.com/firebase/firebaseui-web-react
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
import { collection, collectionGroup, query, where, getDocs, limit, startAfter, orderBy, doc, setDoc, getDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref as refFile, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { RemoveTags } from "./pitch/Constants";
import AppUser from './AppUser';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyDAb0oHSQCeihL0Op9agehWqYQh1-7E4xE",
	authDomain: "tactics-board-1c644.firebaseapp.com",
	projectId: "tactics-board-1c644",
	storageBucket: "tactics-board-1c644.appspot.com",
	messagingSenderId: "704589627362",
	appId: "1:704589627362:web:b110cc834a5f5c19c543bb",
	measurementId: "G-PDXB2VPRL8"
};

class FirebaseServer {
	constructor(siteHomeURL = null, signedInCallback = null) {
		// Initialize Firebase
		this.firebaseApp = firebase.initializeApp(firebaseConfig);
		//const analytics = getAnalytics(firebaseApp);
		this.firestore = getFirestore();
		this.storage = getStorage();
		this.siteHomeURL = siteHomeURL;
		this.signedInCallback = signedInCallback;
	}

	hasHomeURL() {
		return null !== this.siteHomeURL;
	}

	goHomeURL() {
		if (!this.hasHomeURL) {
			return;
		}
		document.location = this.siteHomeURL;
	}

	get AppInstance() {
		return this.firebaseApp;
	}

	SignIn() {}

	async SignOut() {
		await this.firebaseApp.auth().signOut();
	}

	UserChangesSubscribe() {
		// mount handler for authentication
		this.unregisterAuthObserver = this.firebaseApp.auth().onAuthStateChanged((user) => {
			console.log("Current user",user);
			let currentUser = null;
			if (!!user) {
				currentUser = new AppUser(user.displayName, user.photoURL);
			}
			this.signedInCallback(currentUser);
		});
	}

	UserChangesUnsubscribe() {
		this.unregisterAuthObserver();
	}

	async List(tacticsPerPage, afterDoc, dateFrom, dateTo, searchText) {
		// docs to show
		let tacticsList = [];

		const user = this.firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return [null];
		}
		//console.log(user);

		// user root
		const userTacticsRoot = "user-tactics/" + user.uid;

		// get list
		try {
			// build query
			const userTacticsCollection = userTacticsRoot + "/tactics";
			const q = afterDoc ?
				// continue for paging
				query(
					collection(this.firestore, userTacticsCollection), 
					orderBy("updated", "desc"),
					startAfter(afterDoc),
					limit(tacticsPerPage)
				)
				:
				// first page
				query(
					collection(this.firestore, userTacticsCollection), 
					orderBy("updated", "desc"),
					limit(tacticsPerPage)
				)
			;

			// get docs using query
			const res = await getDocs(q)

			// iterate over docs
			res.forEach((doc) => {
				const dta = doc.data();
				//console.log(doc.id, " => ", dta);
				tacticsList.push({
					id: dta.id,
					name: RemoveTags(dta.name),
					description: RemoveTags(dta.description),
					created: new Timestamp(dta.created.seconds, dta.created.nanoseconds).toDate(),
					updated: new Timestamp(dta.updated.seconds, dta.updated.nanoseconds).toDate(),
					docRef: doc
				});
			});
			
			//const last = await res.docs[0];
			//console.log("Found docs",last);
		} catch (error) {
			console.log("Error fetching documents", error);
			return [null];
		}

		// get all thumbnails
		try {
			for (let i = 0; i < tacticsList.length; i++) {
				const userTacticsThumbs = userTacticsRoot + "/tactics-thumbs/" + tacticsList[i].id + ".png";
				const refTmb = refFile(this.storage, userTacticsThumbs);
				tacticsList[i].thumbnail = await getDownloadURL(refTmb);
			}
		} catch (error) {
			console.log("Error fetching thumbnails", error);
			return [null];
		}

		return tacticsList;
	}

	async Save(tactics, thumbnailBlob) {
		const user = this.firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return
		}
		//console.log(user);
	
		console.log("Firebase save", tactics.name, tactics.description);
		//console.log(tactics);
	
		// first create/update user collection
		const tacticsCollection = "user-tactics";
		try {
			const userCollection = { name: user.displayName };
			await setDoc(
				doc(this.firestore, tacticsCollection, user.uid), 
				userCollection, 
				{merge:true}
			);
		} catch (error) {
			console.error("Creating / updating user collection", error);
		}
	
		// user tactics root path for documents and thumbs
		const userTacticsRoot = tacticsCollection + "/" + user.uid;
	
		// 2nd store thumbnail
		try {
			const userTacticsThumbs = userTacticsRoot + "/tactics-thumbs/" + tactics.id + ".png";
			const thumbRef = refFile(this.storage, userTacticsThumbs);
			await uploadBytes(thumbRef, thumbnailBlob);
		} catch (error) {
			console.error("Saving user tactics thumbnail", error);
		}
	
		// 3rd store tactics document
		try {
			// convert dates to firestore timestamps
			tactics.created = Timestamp.fromDate(tactics.created);
			tactics.updated = Timestamp.fromDate(tactics.updated);
			// save
			const userTacticsCollection = userTacticsRoot + "/tactics";
			await setDoc(
				doc(this.firestore, userTacticsCollection, tactics.id), 
				tactics
			);
		} catch (error) {
			console.error("Saving user tactics", error);
		}
	}

	async Load(tacticsID) {
		const user = this.firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return
		}
		//console.log(user);
	
		try {
			console.log("Loading user tactics", tacticsID);
			const userTacticsPath = "user-tactics/" + user.uid + "/tactics/" + tacticsID;
			const tacticsRef = doc(this.firestore, userTacticsPath);
			const res = await getDoc(tacticsRef);
	
			if (!res.exists()) {
				console.log("User tactics not found", tacticsID);
				return null;
			}
	
			let tactics = res.data();
			// fix data
			tactics.created = new Timestamp(
				tactics.created.seconds, 
				tactics.created.nanoseconds
			).toDate();
			tactics.updated = new Timestamp(
				tactics.updated.seconds, 
				tactics.updated.nanoseconds
			).toDate()
			//console.log(res.id, " => ", tactics);
			return tactics;
	
		} catch (error) {
			console.error("Loading user tactics", error);
			return null;
		}
	}

	async LoadShared(tacticsID) {
		const user = this.firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return
		}
		//console.log(user);
	
		console.log("Loading shared tactics", tacticsID);
		let tactics = null;
		try {
			// requires index on collection:tactics and field:id
			const tacticsQuery = query(collectionGroup(this.firestore, 'tactics'), where('id', '==', tacticsID));
			const querySnapshot = await getDocs(tacticsQuery);
			querySnapshot.forEach((doc) => {
				//console.log(doc.id, ' => ', doc.data());
				tactics = doc.data();
				// fix data
				tactics.created = new Timestamp(
					tactics.created.seconds, 
					tactics.created.nanoseconds
				).toDate();
				tactics.updated = new Timestamp(
					tactics.updated.seconds, 
					tactics.updated.nanoseconds
				).toDate()
			});
		} catch (error) {
			console.error("Loading shared tactics", error);
		}
		return tactics;
	}

	async Delete(tacticsID) {
		const user = this.firebaseApp.auth().currentUser;
		if (!user) {
			console.error("User is not signed in");
			return
		}
		//console.log(user);
	
		console.log("Deleting user tactics", tacticsID);
		// user tactics root path for documents and thumbs
		const userTacticsRoot = "user-tactics/" + user.uid;
	
		// 1st delete document
		try {
			const userTacticsPath = userTacticsRoot + "/tactics/" + tacticsID;
			const tacticsRef = doc(this.firestore, userTacticsPath);
			await deleteDoc(tacticsRef);
		} catch (error) {
			console.error("Deleting user tactics", error);
		}
	
		// 2nd delete thumbnail
		try {
			const userTacticsThumb = userTacticsRoot + "/tactics-thumbs/" + tacticsID + ".png";
			const thumbRef = refFile(this.storage, userTacticsThumb);
			await deleteObject(thumbRef);
		} catch (error) {
			console.error("Deleting user tactics thumbnail", error);
		}
	}
}

export default FirebaseServer;
// https://firebase.google.com/docs/web/setup#available-libraries
// For auth using: https://github.com/firebase/firebaseui-web-react
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore } from "firebase/firestore";
import { collection, collectionGroup, query, where, getDocs, limit, startAfter, orderBy, doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref as refFile, uploadBytes, getDownloadURL  } from "firebase/storage";
import { RemoveTags } from "./pitch/Constants";

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

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
//const analytics = getAnalytics(firebaseApp);
const firestore = getFirestore();
const storage = getStorage();


async function fbSave(tactics, thumbnailBlob) {
	const user = firebaseApp.auth().currentUser;
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
		const userDocRef = await setDoc(
			doc(firestore, tacticsCollection, user.uid), 
			userCollection, 
			{merge:true}
		);
		console.log(userDocRef);
	} catch (error) {
		console.error("Creating / updating user collection", error);
	}

	// user tactics root path for documents and thumbs
	const userTacticsRoot = tacticsCollection + "/" + user.uid;

	// 2nd store thumbnail
	try {
		const userTacticsThumbs = userTacticsRoot + "/tactics-thumbs/" + tactics.id + ".png";
		const thumbRef = refFile(storage, userTacticsThumbs);
		uploadBytes(thumbRef, thumbnailBlob).then((snapshot) => {
			console.log('Uploaded a blob or file!', snapshot);
		});
	} catch (error) {
		console.error("Saving tactics board thumbnail", error);
	}

	// 3rd store tactics document
	try {
		// convert dates to firestore timestamps
		tactics.created = Timestamp.fromDate(tactics.created);
		tactics.updated = Timestamp.fromDate(tactics.updated);
		// save
		const userTacticsCollection = userTacticsRoot + "/tactics";
		const tacticsDocRef = await setDoc(
			doc(firestore, userTacticsCollection, tactics.id), 
			tactics
		);
		console.log(tacticsDocRef);
	} catch (error) {
		console.error("Saving tactics board", error);
	}
}

async function fbLoad(tacticsID) {
	const user = firebaseApp.auth().currentUser;
	if (!user) {
		console.error("User is not signed in");
		return
	}
	//console.log(user);

	try {
		console.log("Loading user tactics", tacticsID);
		const userTacticsPath = "user-tactics/" + user.uid + "/tactics/" + tacticsID;
		const tacticsRef = doc(firestore, userTacticsPath);
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

async function fbLoadShared(tacticsID) {
	const user = firebaseApp.auth().currentUser;
	if (!user) {
		console.error("User is not signed in");
		return
	}
	//console.log(user);

	console.log("Loading shared tactics", tacticsID);
	let tactics = null;
	try {
		// requires index on collection:tactics and field:id
		const tacticsQuery = query(collectionGroup(firestore, 'tactics'), where('id', '==', tacticsID));
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

async function fbList(tacticsPerPage, afterDoc){
	// docs to show
	let tacticsList = [];

	const user = firebaseApp.auth().currentUser;
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
				collection(firestore,userTacticsCollection), 
				orderBy("updated", "desc"),
				startAfter(afterDoc),
				limit(tacticsPerPage)
			)
			:
			// first page
			query(
				collection(firestore,userTacticsCollection), 
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
			const refTmb = refFile(storage, userTacticsThumbs);
			tacticsList[i].thumbnail = await getDownloadURL(refTmb);
		}
	} catch (error) {
		console.log("Error fetching thumbnails", error);
		return [null];
	}

	return tacticsList;
}

export { firebaseApp, fbSave, fbLoad, fbLoadShared, fbList }
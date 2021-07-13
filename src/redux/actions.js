import axios from "axios";
import firebase, { firestore } from "../firebase/init";
import { NOTIFICATION_MESSAGES } from "../utils/constants";


// AUTHENTICATION ------------------------

export function userLoggedIn(user = null) {
  return { type: "USER_LOGGED_IN", user };
}

export function userLoggedOut() {
  return { type: "USER_LOGGED_OUT" };
}

// NOTIFICATIONS ------------------------

export function showNotification(message, color="success") {
  return { type: "SHOW_NOTIFICATION", message, color };
}

export function closeNotification() {
  return { type: "CLOSE_NOTIFICATION" };
}

export function showNotificationByName(name) {
  return dispatch => {
    const message = NOTIFICATION_MESSAGES[name];
    dispatch( (message, "success"));
  };
}

// PAGE EDITING ------------------------


export function updateSectionContent(sectionIndex, contentIndex, newContent) {
  return {
    type: "UPDATE_SECTION_CONTENT",
    sectionIndex,
    contentIndex,
    newContent
  };
}

export function addSection(sectionIndex, sectionType="default") {
  return { type: "ADD_SECTION", sectionIndex, sectionType };
}

export function duplicateSection(sectionIndex) {
  return { type: "DUPLICATE_SECTION", sectionIndex };
}

export function deleteSection(sectionIndex) {
  return { type: "DELETE_SECTION", sectionIndex };
}

export function addContentItem(sectionIndex, contentType) {
  return { type: "ADD_CONTENT_ITEM", sectionIndex, contentType };
}

export function updateContentItem(sectionIndex, contentIndex, content) {
  return { type: "UPDATE_CONTENT_ITEM", sectionIndex, contentIndex , content};
}

export function deleteContentItem(sectionIndex, contentIndex) {
  return { type: "DELETE_CONTENT_ITEM", sectionIndex, contentIndex };
}

export function editSectionTag(sectionIndex, tag) {
  return { type: "EDIT_SECTION_TAG", sectionIndex, tag };
}

export function addSidebarContent(sectionIndex, contentType) {
  return { type: "ADD_SIDEBAR_CONTENT", sectionIndex, contentType };
}

export function updateSidebarContent(sectionIndex, content) {
  return { type: "UPDATE_SIDEBAR_CONTENT", sectionIndex, content};
}

export function deleteSidebarContent(sectionIndex) {
  return { type: "DELETE_SIDEBAR_CONTENT", sectionIndex };
}

export function toggleEditing() {
  return { type: "TOGGLE_EDITING" };
}

export function toggleNewPageModal(options) {
  return { type: "TOGGLE_NEW_PAGE_MODAL", options };
}

export function updatePageTitle(title) {
  return { type: "UPDATE_PAGE_TITLE", title };
}

export function updatePageHeaderImage(content) {
  return { type: "UPDATE_PAGE_HEADER_IMAGE", content };
}

export function updatePageContentState(location, content) {
  return { type: "UPDATE_PAGE_CONTENT", location, content };
}

export function setPageContentState(location, content) {
  return { type: "SET_PAGE_CONTENT", location, content };
}

export function savePage(pageData, pageId) {
  return dispatch => {
    const db = firestore;

    console.log({pageData})
    if (typeof(pageData.content) !== "string") {
      pageData.content = JSON.stringify(pageData.content)
    }

    db
      .collection('pages')
      .doc(pageId)
      .set(pageData)
      .then(snap => {
        dispatch(toggleNewPageModal());
        dispatch(
          showNotification(
            "Your page has been saved. Publish your changes to view and edit the page.",
            "success"
          )
        );
      });
  };
}


// rename to updateContent
export function updatePageContent(key, newContent) {
  console.log({ [key]: newContent })
  return (dispatch, getState) => {
    const db = firestore;
    const pageId = getState().page.data.id;
    const content = { ...getState().page.data.content };

    if (!newContent) {
      delete content[key]
    } else {
      content[key] = newContent
    }

    db
      .collection('pages')
      .doc(pageId)
      .update({ content: JSON.stringify(content) })
      .then(res => {
        console.log({ res })
        dispatch(updatePageData(content));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateTitle(title) {
  return (dispatch, getState) => {
    const db = firestore;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ title })
      .then(() => {
        dispatch(updatePageTitle(title));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateHeaderImage(content) {
  return (dispatch, getState) => {
    const db = firestore;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ headerImage: content })
      .then(() => {
        dispatch(updatePageHeaderImage(content));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function deleteHeaderImage() {
  return (dispatch, getState) => {
    const db = firestore;
    const FieldValue = firebase.firestore.FieldValue;
    const pageId = getState().page.data.id;

    db
      .collection('pages')
      .doc(pageId)
      .update({ 'content.headerImage': FieldValue.delete() })
      .then(() => {
        dispatch(updatePageHeaderImage({ imageSrc: null, title: null }));
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        )
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}

export function updateFirebaseData(updates, callback=null) {
  return (dispatch, getState) => {
    const db = firestore;
    console.log(updates)

    db.ref().update(updates, error => {
      if (error) {
        console.log('FIREBASE ERROR', error)
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      if (callback) {
        callback()
      }

      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    });
  };
}

export function savePageContent(innerFunction) {
  return (dispatch, getState) => {
    Promise.resolve(dispatch(innerFunction)).then(() => {
      const content = getState().page.data.content;
      const pageId = getState().page.data.id;

      console.log("content", content)
      console.log("pageId", pageId)

      const db = firestore;

      db.collection('pages')
        .doc(pageId)
        .update({ content: JSON.stringify(content) })
        .then(res => {
          dispatch(
            showNotification(
              "Your changes have been saved. Publish your changes to make them public.",
              "success"
            )
          );
        })
        .catch(error => {
          console.log('error', error)
          return dispatch(
            showNotification(
              `There was an error saving your changes: ${error}`,
              "success"
            )
          );
        })
    });
  };
}

export function updateFirestoreDoc(pageId, data) {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection('pages')
      .doc(pageId)
      .update(data)
      .then(res => {
        dispatch(
          showNotification(
            "Your changes have been saved. Publish your changes to make them public.",
            "success"
          )
        );
      })
      .catch(error => {
        console.log('error', error)
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      })
  };
}


export function deploy() {
  return dispatch => {
    const url = `${process.env.GATSBY_DEPLOY_ENDPOINT}`;
    console.log(`Deploy command sent to ${url}`);

    firebase
      .auth()
      .currentUser.getIdToken(/* forceRefresh */ true)
      .then(token => {
        return axios({
          method: "POST",
          url: url,
          headers: { Authorization: "Bearer " + token }
        });
      })
      .then(res => {
        console.log(res);
        if (res.data.status === "ok") {
          dispatch(
            showNotification(
              res.data.message,
              "success"
            )
          );
        } else {
          dispatch(
            showNotification(
              `There was an error deploying the site: ${res.data.message}`,
              "danger"
            )
          );
        }
      })
      .catch(err => {
        dispatch(
          showNotification(
            `There was an error deploying the site: ${err}`,
            "danger"
          )
        );
      });
  };
}

// export function deployWithStagingContent() {
//   return dispatch => {
//     copyContentFromStaging()
//       .then(() => {
//         dispatch(
//           showNotification(
//             "Your content has been copied from the staging site.",
//             "success"
//           )
//         );
//         dispatch(deploy())
//       })
//       .catch(err => {
//         dispatch(
//           showNotification(
//             `There was an error copying the content from the staging site: ${err}`,
//             "danger"
//           )
//         );
//       })
//   }
// }

export function loadPageData(data) {
  return { type: "LOAD_PAGE_DATA", data };
}

export function updatePageData(contentId, content) {
  return { type: "UPDATE_PAGE_DATA", contentId, content };
}

export function updatePageField(field, value) {
  return { type: "UPDATE_PAGE_FIELD", field, value };
}

export function setPages(pages) {
  return { type: "SET_PAGES", pages }
}

export function setOrderedPages(orderedPages) {
  return { type: "SET_ORDERED_PAGES", orderedPages }
}

export function fetchPages() {
  return (dispatch, getState) => {
    const db = firestore;

    db.collection('pages')
      .get()
      .then(snap => {
        const pagesArr = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        const pages = pagesArr.reduce((obj, page) => {
          obj[page.id] = page
          return obj
        }, {})

        dispatch(setPages(pages));
      })
      .catch(error => {
        console.log("Error fetching pages", error)
      })
  };
}

export function incrementPageOrder(currentPage, nextPage, prevPage) {
  return (dispatch, getState) => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    const currentPageRef = db.collection('pages').doc(currentPage.id)
    const nextPageRef = db.collection('pages').doc(nextPage.id)
    const prevPageRef = prevPage ? db.collection('pages').doc(prevPage.id) : null

    batch.update(currentPageRef, { next: nextPage.next || FieldValue.delete() })
    batch.update(nextPageRef, { next: currentPage.id })

    if (currentPage.head) {
      batch.update(nextPageRef, { head: true })
      batch.update(currentPageRef, { head: FieldValue.delete() })
    }

    if (prevPageRef) {
      batch.update(prevPageRef, { next: nextPage.id })
    }

    batch
      .commit()
      .then(() => {
        dispatch(fetchPages());
        dispatch(showNotification("Your changes have been saved."));
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function decrementPageOrder(currentPage, prevPage, prevPrevPage) {
  return (dispatch, getState) => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    const currentPageRef = db.collection('pages').doc(currentPage.id)
    const prevPageRef = db.collection('pages').doc(prevPage.id)
    const prevPrevPageRef = prevPrevPage ? db.collection('pages').doc(prevPrevPage.id) : null

    batch.update(currentPageRef, { next: prevPage.id })
    batch.update(prevPageRef, { next: currentPage.next || FieldValue.delete() })

    if (prevPage.head) {
      batch.update(currentPageRef, { head: true })
      batch.update(prevPageRef, { head: FieldValue.delete() })
    }

    if (prevPrevPageRef) {
      batch.update(prevPrevPageRef, { next: currentPage.id })
    }

    batch
      .commit()
      .then(() => {
        dispatch(fetchPages());
        dispatch(showNotification("Your changes have been saved."));
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function deletePage(page, nextPage, prevPage, allPages) {
  return (dispatch, getState) => {
    const db = firestore;
    const batch = db.batch();
    const FieldValue = firebase.firestore.FieldValue;

    batch.delete(db.collection('pages').doc(page.id))

    if (prevPage) {
      const prevPageRef = db.collection('pages').doc(prevPage.id)
      batch.update(prevPageRef, { next: page.next || FieldValue.delete() })
    }

    if (page.head && nextPage) {
      const nextPageRef = db.collection('pages').doc(nextPage.id)
      batch.update(nextPageRef, { head: true })
    }

    const transPageIds = Object.keys(allPages).filter(key => allPages[key].translation === page.slug)
    console.log({transPageIds})
    transPageIds.forEach(id => {
      batch.update(db.collection('pages').doc(id), { translation: FieldValue.delete() })
    })

    batch
      .commit()
      .then(() => {
        dispatch(fetchPages());
        dispatch(showNotification("Your changes have been saved."));
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}


// NAVIGATION ------------------------

export function openMenu() {
  return { type: "OPEN_MENU" };
}

export function closeMenu() {
  return { type: "CLOSE_MENU" };
}

export function toggleMenu() {
  return { type: "TOGGLE_MENU" };
}

export function setCurrentLang(currentLang) {
  return { type: "SET_CURRENT_LANG", currentLang }
}


// TOPICS ------------------------

export function selectTopic(selected) {
  return { type: "SELECT_TOPIC", selected };
}

export function unselectTopic(selected) {
  return { type: "UNSELECT_TOPIC", selected };
}

export function addTopic(topic) {
  return { type: "ADD_TOPIC", topic }
}

export function deleteTopic(topic) {
  return { type: "DELETE_TOPIC", topic }
}

export function setTopics(topics) {
  return { type: "SET_TOPICS", topics }
}

export function fetchTopics() {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`topics`)
      .once('value')
      .then(snap => {
        dispatch(setTopics(snap.val()));
      })
      .catch(error => {
        console.log("Error fetching topics", error)
      })
  };
}

export function pushTopic(topic) {
  return (dispatch, getState) => {
    const db = firebase.database();

    db.ref(`topics/${topic.id}`).update(topic, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      }

      dispatch(addTopic(topic));
      dispatch(
        showNotification(
          "Your changes have been saved.",
          "success"
        )
      );
    })
  };
}

export function removeTopic(topicId) {
  return (dispatch, getState) => {
    const db = firebase.database();
    const state = getState();

    db.ref(`topics/`).update({[topicId]: null}, error => {
      if (error) {
        return dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "success"
          )
        );
      }

      let allTopics = { ...state.topics.topics };
      delete allTopics[topicId]

      dispatch(setTopics(allTopics));
      dispatch(
        showNotification(
          "Your changes have been saved. Publish your changes to make them public.",
          "success"
        )
      );
    })
  };
}



// TRANSLATIONS ------------------------

export function updateTranslationState(translation) {
  return { type: "UPDATE_TRANSLATION_STATE", translation}
}


export function fetchTranslations() {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection('translations')
      .get()
      .then(snap => {
        const transArr = snap.docs.map(d => ({ ...d.data(), id: d.id }))
        const transObj = transArr.reduce((obj, t) => {
          obj[t.id] = t
          return obj
        }, {})
        dispatch(setTranslations(transObj))
      })
      .catch(error => {
        console.log("Error fetching translations", error)
      })
  };
}

export function updateTranslation(translation) {
  return (dispatch, getState) => {
    const db = firestore;

    db
      .collection('translations')
      .doc(translation.id)
      .update(translation)
      .then(res => {
        dispatch(fetchTranslations());
        dispatch(
          showNotification(
            "Your changes have been saved.",
            "success"
          )
        );
      })
      .catch(error => {
        dispatch(
          showNotification(
            `There was an error saving your changes: ${error}`,
            "error"
          )
        );
      })
  };
}

export function setTranslations(strings) {
  return { type: "SET_TRANSLATIONS", strings }
}


// TAGS ------------------------

export function setTags(strings) {
  return { type: "SET_TAGS", strings }
}

export function setSelectedTag(selection) {
  return { type: 'SET_SELECTED_TAG', selection}
}

export function saveSelectedTag(selection) {
  return (dispatch, getState) => {
    if (localStorage !== undefined && localStorage !== null) {
      if (selection) {
        localStorage.setItem('money-guide-province-id', selection.id)
      } else {
        localStorage.removeItem('money-guide-province-id')
      }
    }
    dispatch(setSelectedTag(selection))
  }
}

export function openTagSelectorModal() {
  return { type: 'OPEN_TAG_SELECTOR_MODAL' }
}

export function closeTagSelectorModal() {
  return { type: 'CLOSE_TAG_SELECTOR_MODAL' }
}



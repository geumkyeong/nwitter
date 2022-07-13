import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "fbase";

const Nweet = ({ nweetObj, isOwner }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);

  const nweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  const attachmentRef = ref(storageService, nweetObj.attachmentURL);

  const deleteHandler = async () => {
    const ok = window.confirm("정말 이 Nweet을 삭제하시겠습니까?");

    if (ok) {
      try {
        await deleteDoc(nweetTextRef);
        if (nweetObj.attachmentURL) {
          await deleteObject(attachmentRef);
        }
      } catch (error) {
        window.alert("Nweet을 삭제하는 데 실패하였습니다.");
      }
    }
  };

  const toggleHandler = () => setIsEditing((prev) => !prev);

  const changeHandler = (event) => {
    const {
      target: { value },
    } = event;

    setNewNweet(value);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    await updateDoc(nweetTextRef, {
      text: newNweet,
    });

    setIsEditing(false);
  };

  return (
    <div>
      {isEditing && (
        <>
          <form onSubmit={submitHandler}>
            <input
              type="text"
              value={newNweet}
              placeholder="Edit your Nweet"
              required
              onChange={changeHandler}
            />
            <input type="submit" value="Update Nweet" />
          </form>
          <button onClick={toggleHandler}>Cancel</button>
        </>
      )}
      {!isEditing && (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && (
            <img
              src={nweetObj.attachmentURL}
              width="50px"
              height="50px"
              alt="nweet"
            />
          )}
          {isOwner && (
            <>
              <button onClick={deleteHandler}>Delete Nweet</button>
              <button onClick={toggleHandler}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;

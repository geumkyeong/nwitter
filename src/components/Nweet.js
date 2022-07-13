import { useState } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

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

  const editToggleHandler = () => setIsEditing((prev) => !prev);

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
    <div className="nweet">
      {isEditing && (
        <>
          <form onSubmit={submitHandler} className="container nweetEdit">
            <input
              type="text"
              value={newNweet}
              placeholder="Edit your Nweet"
              required
              onChange={changeHandler}
            />
            <input type="submit" value="Update Nweet" className="formBtn" />
          </form>
          <button onClick={editToggleHandler} className="formBtn cancelBtn">
            Cancel
          </button>
        </>
      )}
      {!isEditing && (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentURL && <img src={nweetObj.attachmentURL} />}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={deleteHandler}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={editToggleHandler}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;

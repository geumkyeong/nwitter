import React, { useRef, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";

const NweetFactory = ({userObj}) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");

  const onChangeHandler = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    let attachmentURL = "";
    
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      
      attachmentURL = await getDownloadURL(response.ref);
    }
    
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentURL,
    };

    await addDoc(collection(dbService, "nweets"), nweetObj);

    setNweet("");
    setAttachment("");
  };

  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment(null); // 이미지 프리뷰 없애기
    fileInput.current.value = null; // 첨부 파일명 없애기
  };

  const onFileChangeHandler = (event) => {
    const {
      target: { files },
    } = event;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = (event) => {
      const {
        currentTarget: { result },
      } = event; // 결과(url)

      setAttachment(result); // 저장하기
    };

    if (file) {
      reader.readAsDataURL(file); // 첨부 파일의 url 읽기
    }
  };

  return (
    <form onSubmit={onSubmitHandler}>
      <input
        value={nweet}
        type="text"
        placeholder="What's on your mind?"
        maxLength="120"
        onChange={onChangeHandler}
      />
      <input
        type="file"
        accept="image/*"
        onChange={onFileChangeHandler}
        ref={fileInput}
      />
      <input type="submit" value="Nweet" />
      {attachment && (
        <div>
          <img src={attachment} width="50px" height="50px" alt="preview" />
          <button onClick={onClearAttachment}>Clear</button>
        </div>
      )}
    </form>
  );
};

export default NweetFactory
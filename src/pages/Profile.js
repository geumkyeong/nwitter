import React, { useEffect, useState } from "react";
import { signOut, updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import { authService, dbService } from "fbase";

const Profile = ({ refreshUser, userObj }) => {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const history = useHistory();

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt")
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChangeHandler = (event) => {
    const {
      target: { value },
    } = event;

    setNewDisplayName(value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  const onLogoutHandler = () => {
    signOut(authService);
    history.push("/");
  };

  return (
    <div className="container">
      <form onSubmit={onSubmitHandler} className="profileForm">
        <input
          onChange={onChangeHandler}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
          className="formInput"
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogoutHandler}>
        Log Out
      </span>
    </div>
  );
};

export default Profile;

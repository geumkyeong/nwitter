import { useState, useEffect } from "react";
import AppRouter from "components/Router";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObject, setUserObject] = useState(null);

  useEffect(() => {
    // const auth = getAuth();
    onAuthStateChanged(authService, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObject(user);
      } else {
        setIsLoggedIn(false);
        setUserObject(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = () => {
    const user = authService.currentUser;
    updateCurrentUser(authService, user);
    // 새로운 객체로 대체 => 리렌더링
    setUserObject({...user});
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={isLoggedIn}
          userObj={userObject}
        />
      ) : (
        "Initializing..."
      )}
    </>
  );
}

export default App;

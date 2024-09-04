import throttle from 'lodash.throttle';
import { useCallback, useEffect } from 'react';
import { api } from 'src/utils/api';

const useActivityTracker = () => {
  const { mutate: updateUser } = api.user.updateUser.useMutation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const throttledHandleActivity = useCallback(
    throttle(() => {
      updateUser({
        lastOnline: new Date()
      });
    }, 1000),
    []
  );

  useEffect(() => {
    const events = ['click', 'keydown', 'scroll'];

    events.forEach(event => {
      window.addEventListener(event, throttledHandleActivity);
    });

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, throttledHandleActivity);
      });
    };
  }, [throttledHandleActivity]);
};

export default useActivityTracker;

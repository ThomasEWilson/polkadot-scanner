import { useUser, useSetUser } from '/react-environment/state/modules/application/hooks';

export default function useUserAuth() {
  const isLoggedIn = useUser();
  const mutateUser = useSetUser();

  return { isLoggedIn, mutateUser }
}

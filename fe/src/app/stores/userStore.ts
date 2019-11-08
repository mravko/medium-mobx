import { action, observable } from "mobx";
import { IUser } from "../models/User.model";
import profileStore from "./profileStore";
import agent from "app/services/agent";

export class UserStore {
  @observable public currentUser: IUser | undefined;
  @observable public loadingUser: boolean;
  @observable public updatingUser: boolean;
  @observable public updatingUserErrors: any;

  @action
  public pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(
        action(({ user }) => {
          this.currentUser = user;
          return profileStore.loadMyProfile(user.username);
        })
      )
      .finally(
        action(() => {
          this.loadingUser = false;
        })
      );
  }

  @action
  public updateUser(newUser: IUser) {
    this.updatingUser = true;
    return agent.Auth.save(newUser)
      .then(
        action(({ user }) => {
          this.currentUser = user;
        })
      )
      .catch(
        action((err: any) => {
          this.updatingUserErrors = err && err.data && err.data.errors;
          throw err;
        })
      )
      .finally(
        action(() => {
          this.updatingUser = false;
        })
      );
  }

  @action
  public forgetUser() {
    this.currentUser = undefined;
  }
}

export default new UserStore();

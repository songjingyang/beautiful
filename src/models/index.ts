import { User } from './User';
import { Global } from './Global';
import { Resource } from './Resource';
import { System } from './System';
import { Tourisms } from './Tourism';
import { Tag } from './Tag';
import { Strategy } from './Strategy';
import { Advertisement } from './Advertisement';
import { Comment } from './Comment';
import { Answer } from './Answer';
import { Broadcast } from './Broadcast';
import { Travels } from './Travels';
import { Orders } from './Orders';
import { UserAdmin } from './UserAdmin';
export default {
  user: new User(),
  global: new Global(),
  resource: new Resource(),
  system: new System(),
  tourisms: new Tourisms(),
  tag: new Tag(),
  strategy: new Strategy(),
  advertisement: new Advertisement(),
  comment: new Comment(),
  answer: new Answer(),
  broadcast: new Broadcast(),
  travels: new Travels(),
  orders: new Orders(),
  userAdmin: new UserAdmin()
};

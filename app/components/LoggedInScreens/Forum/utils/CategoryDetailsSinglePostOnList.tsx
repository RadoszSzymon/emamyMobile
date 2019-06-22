import React from "react";
import {
  Image,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import styles from "./../style";
import moment from "moment";
import "moment/locale/pl";
const like: any = require("./../../../../assets/images/like.png");

const CategoryDetailsSinglePostOnList = (props: {
  post: any;
  getPostDetails: any;
  showPosts: boolean;
}): any => {
  const postDate = moment(props.post.created_at).format("LLL");
  return (
    <TouchableHighlight onPress={() => props.getPostDetails(props.post.id)}>
      <View style={styles.singlePostContainer}>
        <View style={{ width: "80%" }}>
          <Text style={styles.singlePostTitle}>{props.post.title}</Text>
          <Text style={styles.singlePostDate}>{postDate}</Text>
          <Text style={styles.singlePostCommentLength}>
            Komentarze: {props.post.comments.length}
          </Text>
        </View>

        <View style={styles.singlePostLikeContainer}>
          <Text style={styles.singlePostLikeContainerVoteLength}>
            {props.post.votes.length}
          </Text>
          <TouchableOpacity>
            <Image
              style={styles.singlePostLikeContainerLikeIcon}
              resizeMode="contain"
              source={like}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableHighlight>
  );
};
export default CategoryDetailsSinglePostOnList;

import React, { useState } from "react";

// Redux
import { useDispatch } from "react-redux";
import { deletePost, likePost } from "../../../actions/posts";

// Material-UI
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  ButtonBase,
} from "@material-ui/core";

// React Router DOM
import { useHistory } from "react-router-dom";

// Moment
import moment from "moment";

// Icon
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreHorizIcon from "@material-ui/icons/MoreHoriz";
import ThumbUpAltOutlined from "@material-ui/icons/ThumbUpAltOutlined";

// Styles
import useStyles from "./styles";

export default function Post({ post, setCurrentId }) {
  const classes = useStyles();
  const [likes, setLikes] = useState(post?.likes);

  // Redux
  const dispatch = useDispatch();

  const history = useHistory();
  // User
  const user = JSON.parse(localStorage.getItem("profile"));
  const userId = user?.result?.googleId || user?.result?._id;
  const userLikedPost = post.likes.find((like) => like === userId);

  const handleLikePost = () => {
    dispatch(likePost(post._id));

    if (userLikedPost) {
      setLikes(post.likes.filter((id) => id !== userId));
    } else {
      setLikes([...post.likes, userId]);
    }
  };

  // Likes Sub Component
  const Likes = () => {
    if (likes.length > 0) {
      return likes.find((like) => like === userId) ? (
        <>
          <ThumbUpAltIcon fontSize="small" />
          &nbsp;
          {likes.length > 2
            ? `You and ${likes.length - 1} others`
            : `${likes.length} like${likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" />
          &nbsp;{likes.length} {likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };

  // Handlers
  const openPost = () => history.push(`/posts/${post._id}`);

  const editHandler = () => {
    setCurrentId(post._id);
  };

  // Return
  return (
    <Card className={classes.card} raised elevation={6}>
      <CardMedia
        className={classes.media}
        image={post.selectedFile}
        title={post.title}
      />
      <div className={classes.overlay}>
        <Typography variant="h6">{post.name}</Typography>
        <Typography variant="body2">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>
      {(user?.result?.googleId === post?.creator ||
        user?.result?._id === post?.creator) && (
        <div className={classes.overlay2}>
          <Button style={{ color: "white" }} size="small" onClick={editHandler}>
            <MoreHorizIcon fontSize="medium" />
          </Button>
        </div>
      )}
      <ButtonBase className={classes.cardAction} onClick={openPost}>
        <div className={classes.details}>
          <Typography variant="body2" color="textSecondary">
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
        </div>
        <Typography className={classes.title} variant="h5" gutterBottom>
          {post.title}
        </Typography>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
            {post.message}
          </Typography>
        </CardContent>
      </ButtonBase>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          color="primary"
          onClick={handleLikePost}
          disabled={!user?.result}
        >
          <Likes />
        </Button>
        {(user?.result?.googleId === post?.creator ||
          user?.result?._id === post?.creator) && (
          <Button
            size="small"
            color="primary"
            onClick={() => {
              dispatch(deletePost(post._id));
            }}
          >
            <DeleteIcon fontSize="small" />
            Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

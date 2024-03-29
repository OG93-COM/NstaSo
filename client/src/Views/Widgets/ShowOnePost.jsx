import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';import ShareIcon from '@mui/icons-material/Share';
import CommentOutlinedIcon from '@mui/icons-material/CommentOutlined';
import { Box, Divider, IconButton, Typography, useTheme,InputBase } from "@mui/material";
import FlexBetween from "Components/FlexBetween";
import Friends from "Components/Friends";
import Widgets from "Components/Widgets";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "State";
import ProfilePicture from "Components/ProfilePicture";
  
  const ShowOnePost = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
  }) => {
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const userNameLogin = useSelector((state) => state.user.firstName);
    const userPicturePathLogin = useSelector((state) => state.user.picturePath);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
  
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
  
    const patchLike = async () => {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };
  
    return (
      <Widgets m="2rem 0">
        <Friends friendId={postUserId} name={name} subtitle={location} userPicturePath={userPicturePath} />
        <Typography color={main} sx={{ mt: "1rem" }}> {description} </Typography>
        {picturePath && (
          <img width="100%" height="auto" alt="post" style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }} 
                src={`http://localhost:3001/assets/${picturePath}`} /> )}
        <FlexBetween mt="0.25rem">
          <FlexBetween gap="1rem">
            <FlexBetween gap="0.3rem">
              <IconButton onClick={patchLike}>
                {isLiked ? (
                  <FavoriteOutlined sx={{ color: primary }} />
                ) : (
                  <FavoriteBorderOutlined />
                )}
              </IconButton>
              <Typography>{likeCount}</Typography>
            </FlexBetween>
  
            <FlexBetween gap="0.3rem">
              <IconButton onClick={() => setIsComments(!isComments)}>
                <ChatBubbleOutlineOutlined />
              </IconButton>
              <Typography>{comments.length}</Typography>
            </FlexBetween>
          </FlexBetween>
  
          <IconButton>
            <ShareIcon/>
          </IconButton>
        </FlexBetween>
        {isComments && (
          <Box mt="0.5rem">
            {comments.map((comment, i) => (
              <Box key={`${name}-${i}`}>
                <Divider />
                <Typography sx={{ color: main, m: "0.5rem 0", pl: "1rem" }}>
                  <CommentOutlinedIcon/>  {comment}
                </Typography>
                <Divider />
              </Box>
            ))}
            <Divider />
          </Box>
        )}
        <Divider />
        <FlexBetween gap="1.5rem" mt="15px">
            <ProfilePicture image={userPicturePathLogin}/> 
            <InputBase  placeholder=" Write A Comment here..." 
                        sx={{
                        width: "98%",
                        backgroundColor: palette.neutral.light,
                        borderRadius: "1.5rem",
                        padding: "0.7rem 2rem",
                        }}/>

            <IconButton><AddBoxOutlinedIcon/></IconButton>
        </FlexBetween>
      </Widgets>
    );
  };

  export default ShowOnePost;
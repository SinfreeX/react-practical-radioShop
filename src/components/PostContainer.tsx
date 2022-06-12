import React from 'react';
import {postAPI} from "../services/PostService";
import PostItem from "./PostItem";


const PostContainer = () => {
    const {data: posts, error, isLoading} = postAPI.useGetPostsQuery(5)

    return (
        <div>
            <div className="post__list">
                {isLoading && <h1>Загрузка...</h1>}
                {error && <h1>Произошла ошибка</h1>}
                {posts && posts.map(post =>
                    <PostItem key={post.id} post={post}/>
                )}
            </div>
        </div>
    );
};

export default PostContainer;
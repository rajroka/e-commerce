import React from "react";

async function ProductCommentById({ params } : { params: { productId: string; commentId: string } }) {
  const productId =  params.productId;
  const commentId =  params.commentId;
                
  return (
    <div>
      Product of id: {productId} and comment of id: {commentId}
    </div>
  );
}

export default ProductCommentById;
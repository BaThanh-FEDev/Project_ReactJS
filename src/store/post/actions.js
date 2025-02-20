import { createAction } from "@reduxjs/toolkit";

export const POST_NEW = "POST_NEW";
export const POST_POPULAR = "POST_POPULAR";
export const POST_GENERAL = "POST_GENERAL";
export const GET_SLUG = "GET_SLUG";
export const POST_RELATED = "POST_RELATED"
export const GET_IDPOST = "GET_IDPOST"

export const actPostNew = createAction(POST_NEW);
export const actPostPoPular = createAction(POST_POPULAR);
export const actPostGeneral = createAction(POST_GENERAL);
export const actGetSlug = createAction(GET_SLUG);
export const actPostRelated = createAction(POST_RELATED);
export const actGetIDPost = createAction(GET_IDPOST)
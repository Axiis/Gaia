﻿using Gaia.Core.Services;
using static Axis.Luna.Extensions.ExceptionExtensions;
using static Axis.Luna.Extensions.ObjectExtensions;
using static Axis.Luna.Extensions.OperationExtensions;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Gaia.Server.Controllers.CommentModels;
using Axis.Luna;

namespace Gaia.Server.Controllers
{
    public class CommentController : ApiController
    {
        private ICommentService _commentService = null;

        public CommentController(ICommentService commentService)
        {
            ThrowNullArguments(() => commentService);

            this._commentService = commentService;
        }


        [HttpGet]
        [Route("api/comments/@{contextName}/@{contextId}")]
        IHttpActionResult CommentsFor(string contextName, long contextId)
            => _commentService.CommentsFor(contextName, contextId)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;


        [HttpPost]
        [Route("api/comments")]
        IHttpActionResult CommentOn([FromBody]Comment comment)
            => _commentService.CommentOn(comment?.ContextName, comment?.ContextId ?? 0, comment?.CommentText)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;


        [HttpPost]
        [Route("api/comments/replies")]
        IHttpActionResult ReplyTo([FromBody]Comment comment)
            => _commentService.ReplyTo(comment?.ContextId ?? 0, comment?.CommentText)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;


        [HttpPost]
        [Route("api/reactions")]
        IHttpActionResult ReactTo([FromBody]Reaction reaction)
            => _commentService.ReactTo(reaction?.ContextName, reaction?.ContextId ?? 0, reaction?.ReactionCode)
                .Then(opr => Ok(opr).As<IHttpActionResult>())
                .Instead(opr => InternalServerError(opr.GetException()))
                .Result;
    }

    namespace CommentModels
    {
        public class Comment
        {
            public string ContextName { get; set; }
            public long ContextId { get; set; }
            public string CommentText { get; set; }
        }

        public class Reaction
        {
            public string ContextName { get; set; }
            public long ContextId { get; set; }
            public string ReactionCode { get; set; }
        }
    }
}
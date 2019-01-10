module.exports = {
  // allows for adding sections in template files
  section(name, options) {
    if(!this._sections) this._sections = {};
    this._sections[name] = options.fn(this);
    return null;
  },
  // checks if user has permissions to edit/delete pins
  editOrDelete(pinAuthorID, loggedUserID) {
    if(pinAuthorID == loggedUserID) {
      return `
      <div class="edit-delete">
        <button id="edit-pin-btn">edit</button>
        <button id="delete-pin-btn">delete</button>
      </div>
      <script src="/js/edit_delete_modals.js"></script>`;
    } else {
      return '';
    }
  },
  // format date
  formatDate(dateFromMongo) {
    const formattedDate = dateFromMongo.toString().slice(4, 16);
    return formattedDate;
  },
  // checks if user has permissions to edit/delete comments
  deleteComment(commentAuthorID, loggedUserID, pinID, deleteID) {
    if(commentAuthorID == loggedUserID) {
      return `
      <form id="delete-comment-form" action="/pin/${pinID}/comment/delete?_method=DELETE" method="POST">
        <input type="hidden" name="_method" value="DELETE">
        <input type="hidden" name="deleteID" value="${deleteID}">
        <input type="hidden" name="commentAuthorID" value="${commentAuthorID}">
        <input type="hidden" name="loggedUserID" value="${loggedUserID}">
        <button type="submit">delete</button>
      </form>`;
    } else {
      return '';
    }
  }
}

/*globals console sparks $ jQuery debug */

(function (){
    sparks.CouchDS = function (_post_path, _user){
        this.data = "";
        this.user = _user;
        this.enableLoadAndSave = true;
        
        // assumes portal will give us a save path of the form 'couch_url:db_name/junk'
        this.postPath = _post_path.split(":")[0];
        this.db = _post_path.split(":")[1].split("/")[0];
        
        $.couch.urlPrefix = this.postPath;
    };

    sparks.CouchDS.prototype =
    {
        // write the data
        save: function (_data) {
          _data.user = this.user;
          $.couch.db(this.db).saveDoc(  
            _data,  
            {success: function() { console.log("Saved ok"); }}  
          );
        },
    
        load: function (context,callback) {

        }
    };
})();
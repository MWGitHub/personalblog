personalblog
============

This is a simple blog that uses node.js and mongoDB. It uses
express as the framework, jade for templates, and stylus for css.

In order to keep the site simple only essential features will be
implemented.

### Features

-   Authentication for admin actions.
-   Customizable menu can be changed through the admin interface and
    menu items that only show for the admin.
-   All pages for this site are blog posts.
-   Blog posts can be set to unpublished to hide it from the blog index.
    The posts will still be viewable with a direct link.
-   Comments can be enabled and disabled per post.
-   Posts are written and edited using ckeditor if provided.

### Planned Features

-   ~~Better admin user registration (requires enabling and disabled
    register for now)~~ (complete)
-   User roles (Undecided as this is supposed to be a blog for a single
    person)
-   ~~Customizing the menu through an admin page.~~ (complete)
-   Pagination for blog posts.
-   ~~Admin links on individual posts.~~ (complete)
-   ~~Ability to turn off comments for specific posts.~~ (complete)

### Installation

Install [node.js][] and [mongoDB][] onto the server.  
Install the modules by running "npm install".  
Create an admin (currently the only role for any user) user by running
"node app.js --createuser yourusername yourpassword"  
Edit the config-sample.js file to match your needs and save it as
config.js in lib.  
Start the server using "node app.js".  

  [https://github.com/MWGitHub/personalblog]: https://github.com/MWGitHub/personalblog
  [node.js]: http://nodejs.org/
  [mongoDB]: http://www.mongodb.org/

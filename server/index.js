const Path = require('path'),
    Hapi = require('hapi'),
    Bounce = require('bounce'),
    Webpack = require('webpack'),
    Inert = require('inert'),
    fs = require('fs');
//const DashboardPlugin = require('webpack-dashboard/plugin');
const Config = require('../webpack.config.js');

const host = 'localhost';
const port = 3000;
const Server = new Hapi.server({
    host: host, 
    port: port
});

const compiler = Webpack(Config);
//compiler.apply(new DashboardPlugin());

const devMiddleware = require('webpack-dev-middleware')(compiler, {
    host,
    port,
    historyApiFallback: true,
    publicPath: Config.output.publicPath,
    quiet: true  // important for webpack-dashboard to work
});

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
    log: () => {}
});

Server.ext('onRequest', async (request, h) => {
    const error = await new Promise((res, rej) => {
       devMiddleware(request.raw.req, request.raw.res, (err) => {
        if (err) rej(err)
        else res()

       // return h.continue;
    });
});
    if(error){
      return  h.response(error);
    }
    return h.continue;
    });

Server.ext('onRequest', async (request, h) => {

    const error = await hotMiddleware(request.raw.req, request.raw.res, (err) => {

      if (err) {
          return err;
      }

  });
  if(error){
    return  h.response(error);
  }
  return h.continue;
});
const readFile = (path, opts = 'utf8') =>
    new Promise((res, rej) => {
        fs.readFile(path, opts, (err, data) => {
            if (err) rej(err)
            else res(data)
        })
    })
const provision = async () => {

    await Server.register([require('inert')])

    Server.route([
        {
            method: 'GET',
            path: '/images/boxart/{id*}',
            handler: {
                directory: {
                    path: Path.join(__dirname, '../assets/images/boxart'),
                    listing: false
                }
            }
        },
        {
            method: 'GET',
            path: '/images/displayart/{id*}',
            handler: {
                directory: {
                    path: Path.join(__dirname, '../assets/images/displayart'),
                    listing: false
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/shows',
            handler: async (request, h) => {
                
                try {
                  const data = await readFile(Path.join(__dirname, '../assets/data/metadata.json'));
                  const myList = JSON.parse(data).map(v=>{
                      return {
                          videoId: v.videoId,
                          title: v.title,
                          category: 'myList'
                      }
                  })
                  const trendingList = JSON.parse(data).sort((a,b)=>b.releaseYear - a.releaseYear).map(v=>{
                    return {
                        videoId: v.videoId,
                        title: v.title,
                        category: 'trending'
                    }
                })
                  return h.response(myList.concat(trendingList))
                } catch (e) {
                    Bounce.rethrow(e, 'system')
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/shows/{videoId}',
            handler: async (request, h) => {
                
                try {
                  const data = await readFile(Path.join(__dirname, '../assets/data/metadata.json'));
                  const video = JSON.parse(data).filter(v=>v.videoId == request.params.videoId)
                  return h.response(video[0])
                } catch (e) {
                    Bounce.rethrow(e, 'system')
                }
            }
        },
        {
            method: 'GET',
            path: '/hello',
            handler: async (request, h) => {

                let data = 'hello'

                try {

                return h.response({data: data})

                } catch(err) {

                Bounce.rethrow(err, 'system')
                }

                return data
            }
        }
    ]);

    await Server.start();

    console.log('Server running at:', Server.info.uri);
};

provision();
  

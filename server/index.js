const Path = require('path'),
    Hapi = require('hapi'),
    Bounce = require('bounce'),
    Webpack = require('webpack'),
    Inert = require('inert'),
    fs = require('fs'),
    Config = require('../webpack.config.js');

const host = 'localhost',
      port = 3000,
      Server = new Hapi.server({
        host: host, 
        port: port
    });

const compiler = Webpack(Config);

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
    });
});
    if(error){
      return  h.response(error);
    }
    return h.continue;
    });

Server.ext('onRequest', async (request, h) => {
    const error = await new Promise((res, rej) => {
        hotMiddleware(request.raw.req, request.raw.res, (err) => {
            if (err) rej(err)
            else res()
        });
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
const findIndex = (arr, id) => {
    if (!id) return 0;
    let idx = 0;
    arr.forEach((v, index)=>{
        if(v.videoId == id) {
            idx = index; 
        }
    })
    return idx;
}
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
            method: 'POST',
            path: '/api/v1/videos',
            handler: async (request, h) => {
                try {
                const limit = request.payload.limit,
                      offset = request.payload.offset,
                      category = request.payload.category,
                      data = await readFile(Path.join(__dirname, '../assets/data/metadata.json')),
                      parsedData = JSON.parse(data)
                let res = [];
                if(category == 0){
                    const myList = parsedData.map(v => {
                        return {
                            videoId: v.videoId,
                            title: v.title
                        }
                    })
                    const index = findIndex(myList, offset)
                    res = myList.slice(index, index + limit)
                } else {
                    const trendingList = parsedData.sort((a,b)=>b.releaseYear - a.releaseYear).map(v => {
                        return {
                            videoId: v.videoId,
                            title: v.title
                        }
                      })
                    const index = findIndex(trendingList, offset)
                    res = trendingList.slice(index, index + limit)
                }
                return h.response(res)
                }
                catch(err) {
                      Bounce.rethrow(err, 'system')
                }
                    return payload
            }
        },
        {
            method: 'GET',
            path: '/api/v1/videos',
            handler: async (request, h) => {
                
                try {
                    const data = await readFile(Path.join(__dirname, '../assets/data/metadata.json'))
                    const myList = JSON.parse(data).map(v => {
                        return {
                            videoId: v.videoId,
                            title: v.title
                        }
                    })
                    const trendingList = JSON.parse(data).sort((a,b)=>b.releaseYear - a.releaseYear).map(v => {
                        return {
                            videoId: v.videoId,
                            title: v.title
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
            path: '/api/v1/categories',
            handler: async (request, h) => {
                
                try {
                  const data = [
                    {
                        id: '0',
                        title: 'My List'
                    },
                    {
                        id: '1',
                        title: 'New Releases',
                    }
                 ];
                  return h.response(data)
                } catch (e) {
                    Bounce.rethrow(e, 'system')
                }
            }
        },
        {
            method: 'GET',
            path: '/api/v1/videos/{videoId}',
            handler: async (request, h) => {
                
                try {
                  const data = await readFile(Path.join(__dirname, '../assets/data/metadata.json'));
                  const video = JSON.parse(data).filter(v => v.videoId === request.params.videoId)
                  return h.response(video[0])
                } catch (e) {
                    Bounce.rethrow(e, 'system')
                }
            }
        },
        {
            method: 'GET',
            path: '/',
            handler: async (request, h) => {
                try {
                    return h.file(Path.join(__dirname, '../dist/index.html'))
                }  catch(err) {
                    Bounce.rethrow(err, 'system')
                }
            }
          },
          {
            method: 'GET',
            path: '/details/{videoId}',
            handler: async (request, h) => {
                try {
                    return h.file(Path.join(__dirname, '../dist/index.html'))
                }  catch(err) {
                    Bounce.rethrow(err, 'system')
                }
            }
          },
          {  
            method: [ 'GET', 'POST' ],
            path: '/{nofound*}',
            handler: (request, h) => {
                
                try {
                        return h.response("This page is not available.")
                    } catch(err) {
                        Bounce.rethrow(err, 'system')
                    }
                               
            }
          }
    ]);

    await Server.start();

    console.log('Server running at:', Server.info.uri);
};

provision();
  

const { toBeHex } = require('ethers');
const _ = require('lodash');
const config = require('config-yml');

const { equalsIgnoreCase, toArray, normalizeQuote } = require('./');

const { chains, tokens } = { ...config };

const getChains = (chain_types = []) => {
  chain_types = toArray(chain_types);
  return (
    Object.fromEntries(
      Object.entries({ ...chains })
        .filter(([k, v]) => chain_types.length < 1 || chain_types.includes(k))
        .flatMap(([k, v]) =>
          Object.entries({ ...v }).map(([_k, _v]) => {
            const { chain_id, endpoints, native_token, name, explorer } = { ..._v };
            const { rpc } = { ...endpoints };
            const { url } = { ...explorer };
            let provider_params;
            switch (k) {
              case 'evm':
                provider_params = [{
                  chainId: toBeHex(chain_id),
                  chainName: name,
                  rpcUrls: toArray(rpc),
                  nativeCurrency: native_token,
                  blockExplorerUrls: [url],
                }];
                break;
              case 'cosmos': 
              //not provided 'tobehex()' like funciton for cosmos chain_id like evm, need research
                provider_params = [{
                  chainId: chain_id, 
                  chainName: name,
                  rpcUrls: toArray(rpc),
                  nativeCurrency: native_token,
                  blockExplorerUrls: [url],
                }]
              default:
                break;
            }
            _v = {
              ..._v,
              id: _k,
              chain_type: k,
              provider_params,
            };
            return [`${k}-${_k}`, _v];
          })
        )
    )
  )
};

const getChainsList = (chain_types = []) => Object.values({ ...getChains(chain_types) });

const getChainKey = (chain, chain_types = []) => {
  let key;
  if (chain) {
    chain = normalizeQuote(chain, 'lower');
    key = _.head(
      Object.entries({ ...getChains(chain_types) })
        .filter(([k, v]) => {
          const { id, name, chain_type } = { ...v };
          return toArray([id, name]).findIndex(s => equalsIgnoreCase(chain, s) || (chain_type !== 'evm' && chain.startsWith(s))) > -1;
        })
        .map(([k, v]) => k)
    );
    key = key || chain;
  }
  return key;
};

const getChainData = (chain, chain_types = []) => chain && getChains(chain_types)[getChainKey(chain, chain_types)];

const getTokens = () => Object.entries({ ...tokens }).map(([k, v]) => { return { id: k, asset_id: k, ...v }; });
const getToken = id => getTokens().find(d => ['id', 'coingecko_id'].findIndex(k => equalsIgnoreCase(d[k], id)) > -1);

module.exports = {
  CACHE_COLLECTION: 'caches',
  ASSET_COLLECTION: 'assets',
  CURRENCY: 'usd',
  getChains,
  getChainsList,
  getChainKey,
  getChainData,
  getTokens,
  getToken,
};
const v1 = {
  version: 'v1',
  intro: {
    description:
      '此项目接口具有统一规范，响应体ret为200时表示请求有效运行正常。响应体ret为400以及以上时表示请求无效不能完成请求。一般响应只有200和500两种状态，如果可能出现200以外的正常状态，在该接口上会另外说明。值得说明的是，500错误也有可能是后端代码错误等原因引起的，请求不可执行或者是纯粹的逻辑问题等（比如佣金不够），错误信息均会由中文写成，如果出现英文错误信息则有可能是后端异常，此时请直接戳董江彬部长。',
    examples: [
      { description: '成功', response: { ret: 200, data: '...' }},
      { description: '失败', response: { ret: 500, msg: '中文错误信息' }}
    ]
  },
  groups: {
    UserAndAuth: {
      name: '注册与登录',
      apis: {
        register: {
          name: '注册v1',
          method: 'POST',
          url: '/api/v1/user/register',
          description:
            '注册一个新用户，已有用户则返回错误。请求体中username是用户名，password是密码，用户名和密码均有长度限制和字符范围限制，注册失败时返回ret为500。',
          examples: [
            {
              description: '正常注册',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'secret' }
              },
              response: { ret: 200, data: '注册成功' }
            },
            {
              description: '如果用户已经存在',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'secret' }
              },
              response: { ret: 500, msg: '用户已存在' }
            }
          ]
        },
        login: {
          name: '登录',
          method: 'POST',
          url: '/api/v1/auth/login',
          description:
            '用户登录，将登录信息保存到session中，一定时间内请求都处于登陆状态。请求体中username是用户名，password是密码。',
          examples: [
            {
              description: '正常登录时',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'secret' }
              },
              response: { ret: 200, data: '登录成功' }
            },
            {
              description: '密码错误时',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'error' }
              },
              response: { ret: 500, msg: '用户名或密码错误' }
            }
          ]
        },
        getLoginInfo: {
          name: '获取登录信息',
          method: 'GET',
          url: '/api/v1/auth/get_login_info',
          description:
            '获取当前登录信息，登录成功则返回info为用户详情，否则login为0。',
          examples: [
            {
              description: '如果现在处于登陆状态',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: {
                  login: 1,
                  info: { id: 1, username: 'myusername', money: 100 }
                }
              }
            },
            {
              description: '如果现在处于登出状态',
              request: { params: null, query: null, body: null },
              response: { ret: 200, data: { login: 0 }}
            }
          ]
        },
        logout: {
          name: '登出',
          method: 'POST',
          url: '/api/v1/auth/logout',
          description: '退出登录，返回退出前状态。',
          examples: [
            {
              description: '如果在登录状态下登出',
              request: { params: null, query: null, body: null },
              response: { ret: 200, data: { login: 1 }}
            },
            {
              description: '如果现在处于登出状态',
              request: { params: null, query: null, body: null },
              response: { ret: 200, data: { login: 0 }}
            }
          ]
        }
      }
    },
    Ninja: {
      name: '忍者雇佣与显示',
      apis: {
        getBoard: {
          name: '获取招募广场信息',
          method: 'GET',
          url: '/api/v1/ninja/get_board',
          description:
            '显示几种忍者，每种忍者的稀有度，以及雇佣它所需要的金钱。响应为数组，每个元素为一种稀有度忍者的雇佣信息：rarity为这种忍者的稀有度，1代表N，2代表R，3代表SR，4代表SSR，5代表UR；cost为雇佣一个忍者所消耗的金钱。雇佣成功后数据库中当前用户的余额自动减少。当前用户钱不够时返回ret500和一条有趣的信息。',
          examples: [
            {
              description: '获取信息',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  { rarity: 1, cost: 5 },
                  { rarity: 2, cost: 75 },
                  { rarity: 3, cost: 200 },
                  { rarity: 4, cost: 750 },
                  { rarity: 5, cost: 2000 }
                ]
              }
            }
          ]
        },
        hire: {
          name: '雇佣一个忍者',
          method: 'POST',
          url: '/api/v1/ninja/hire',
          description:
            '给定一个稀有度，雇佣该种稀有度的忍者，如果钱不够则返回错误。请求体中rarity是要雇佣忍者的稀有度，用数字表示，不要传字符串。返回响应包含两个字段：name表示这个忍者的名字，msg是雇佣信息（自己生成点别的也可以，不一定用这个字段）。',
          examples: [
            {
              description: '钱够',
              request: { params: null, query: null, body: { rarity: 1 }},
              response: {
                ret: 200,
                data: { name: '藤本 浩', msg: '藤本 浩已经归入你麾下' }
              }
            }
          ]
        },
        getMyNinjas: {
          name: '获取从属忍者',
          method: 'GET',
          url: '/api/v1/ninja/get_my_ninjas',
          description:
            '获取你现在所拥有的所有忍者，需要登录。返回数据为一个数组，数组中每个元素代表一个忍者的相关信息，id为这个忍者的唯一标识，其他请求需要以此标识不同的忍者；name是忍者的姓名，忍者过多时可能会重复；atk是这个忍者的攻击力，def是这个忍者的防御力，maxhp是这个忍者的最大体力值；hp是这个忍者的当前体力值，当hp为0时表明此忍者已经死亡；rarity是这个忍者的稀有度，仍然是使用数字表示；skills是一个对象数组，每个元素代表一个技能，name为技能名称，level为该技能当前等级description为技能特性描述，描述会随着技能等级变化而改变',
          examples: [
            {
              description: '处于登陆状态时',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  {
                    id: 1,
                    name: '藤本 浩',
                    atk: 19,
                    def: 16,
                    maxhp: 51,
                    hp: 51,
                    rarity: 2,
                    skills: [
                      {
                        name: '青山之柴',
                        level: 1,
                        description:
                          '战败时有10%的概率不会阵亡，留下1点体力。'
                      },
                      {
                        name: '斩草除根',
                        level: 2,
                        description: '当敌人生命值低于5%时下一次攻击斩杀。'
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        cure: {
          name: '治疗某个忍者',
          method: 'POST',
          url: '/api/v1/ninja/cure',
          description:
            '治疗某个忍者，ninja_id表示要治疗的忍者编号，忍者必须没有阵亡，并且隶属于自己。治疗只能一次治疗到满体力，每一点体力金钱消耗为5。',
          examples: [
            {
              description: '忍者从属自己，并且没有死亡。',
              request: { params: null, query: null, body: { ninja_id: 1 }},
              response: { ret: 200, data: '藤本 浩已经活力四射了' }
            }
          ]
        },
        fire: {
          name: '解雇某个忍者',
          method: 'POST',
          url: '/api/v1/ninja/fire',
          description:
            '解雇某个忍者，ninja_id表示要解雇的忍者编号，忍者必须没有阵亡，并且隶属于自己。解雇返回该忍者当前等级对应佣金的80%',
          examples: [
            {
              description: '忍者从属自己，并且没有死亡。',
              request: { params: null, query: null, body: { ninja_id: 1 }},
              response: { ret: 200, data: '藤本浩已经归隐于世了' }
            }
          ]
        }
      }
    },
    Task: {
      name: '任务',
      apis: {
        getAllTask: {
          name: '获取所有的任务',
          method: 'GET',
          url: '/api/v1/task/get_all_task',
          description:
            '获取所有的任务，返回数据为数组，每个元素代表一个任务。id为任务编号，执行任务需要此编号；task_name为任务名；difficulty为任务难度，决定这个任务成功的概率；risk是危险度，决定当任务执行失败后忍者的死亡的概率；cycle_time是任务刷新时间，以秒为单位，执行某任务后需要等待cycle_time秒后才能再执行第二次；reward是任务奖励，即任务执行成功后给的金钱报酬；last_execute是上次执行时间，时间戳单位为秒，即当前用户上次执行此任务的时间，若从未执行过则为null。任务成功率和忍者死亡率还和忍者本身能力相关，具体见执行接口。',
          examples: [
            {
              description: '获取当前所有的任务（包括每个任务上次执行时间）',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  {
                    id: 1,
                    task_name: '巡逻',
                    difficulty: 0,
                    disk: 0,
                    cycle_time: 600,
                    reward: 10,
                    last_execute: 1539187200
                  },
                  {
                    id: 2,
                    task_name: '侦查',
                    difficulty: 10,
                    disk: 5,
                    cycle_time: 600,
                    reward: 10,
                    last_execute: null
                  }
                ]
              }
            }
          ]
        },
        execute: {
          name: '执行任务',
          method: 'POST',
          url: '/api/v1/task/execute',
          description:
            '给定忍者编号和任务编号，让某个忍者执行某个任务。请求体中ninja_id是忍者的编号，task_id是任务的编号。执行任务要求此忍者没有阵亡并且任务处于可执行状态，即上次执行时间距离当前时间超过cycle_time秒。任务难度和危险度将会影响任务执行成功的概率，(100 - difficulty)就是一般情况下任务执行成功的概率，难度为0则100%成功，难度为100则不可能成功。忍者的稀有度影响成功概率，N以上每一个等级增加10%的任务成功率，如难度为80的任务在SR稀有度的忍者手中难度降低为60，成功率为40%。当任务执行失败时有一定概率造成忍者死亡，任务成功则忍者不会死亡，失败的概率与任务危险度相关，risk即为死亡概率，危险度为0则不会死亡，危险度为100则任务失败时忍者必定死亡。类似于难度，忍者的稀有度将会影响危险度，忍者等级N以上每一个等级将减少20的危险度。例如一个SSR稀有度的忍者执行一个危险度为80的任务，如果执行失败则死亡概率仅为(80 - 3 * 20) = 20%，如果是UR稀有度的忍者则执行此任务不会死亡。响应体中的参数task_success表示任务执行是否成功，true为成功，false为失败。参数ninja_dead表示忍者是否死亡，true为死亡，false为存活，参数ninja_level_up是一个对象，内含两个参数表示忍者是否因为此任务升级，ninja_level_up.rarity表示稀有度是否升高，true为稀有度升高，false为稀有度保持不变，ninja_level_up.skills表示是否获得新技能或者技能升级，true为获得了新技能或者技能升级，false为没有获得新技能也没有任何技能获得升级',
          examples: [
            {
              description: '正常执行',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 1, task_id: 1 }
              },
              response: {
                ret: 200,
                data: {
                  task_success: true,
                  ninja_dead: false,
                  ninja_level_up: { rarity: false, skills: false }
                }
              }
            },
            {
              description: '忍者已死亡',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 2, task_id: 1 }
              },
              response: { ret: 500, msg: '这个忍者已经阵亡了' }
            },
            {
              description: '任务暂时不能执行',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 1, task_id: 2 }
              },
              response: { ret: 500, msg: '现在还不能执行这个任务哦！' }
            }
          ]
        }
      }
    },
    Boss: {
      name: '战斗',
      apis: {
        getAllBoss: {
          name: '获取所有的BOSS',
          method: 'GET',
          url: '/api/v1/boss/get_all_boss',
          description:
            '获取所有的BOSS及状态，返回数据为数组，每个元素代表一个任务。id为BOSS编号，挑战BOSS需要此编号；name为BOSS名称；atk为BOSS攻击力；def为BOSS防御力；maxhp为BOSS总体力，即BOSS复活时体力；skills为BOSS所拥有的技能，与忍者技能系统相同；pass为该BOSS共被全服玩家击败过多少次；fail为该BOSS总共消灭掉过多少忍者；cycle_time为BOSS死亡后的复活时；reward为击杀该BOSS所能获得的收益；hp为当前BOSS剩余体力值；last_fight为上次挑战该BOSS的时间；last_kill为上次成功击杀该BOSS的时间。BOSS体力会延续，如果忍者未能击杀该BOSS，则可以换另一个忍者与其战斗，体力仍按上次剩余开始。BOSS死亡后将经过一段时间才能复活，复活后可以再次挑战。',
          examples: [
            {
              description: '获取所有的BOSS以及其状态',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  {
                    id: 1,
                    name: '高等数学',
                    atk: 50,
                    def: 50,
                    maxhp: 300,
                    skills: [
                      {
                        name: '反伤刃甲',
                        level: 3,
                        description: '受到伤害时反射21%的伤害。'
                      },
                      {
                        name: '闪亮登场',
                        level: 4,
                        description:
                          '出场时对敌方造成对方最大生命值20%的伤害。'
                      }
                    ],
                    pass: 0,
                    fail: 0,
                    cycle_time: 600,
                    reward: 1000,
                    hp: null,
                    last_fight: null,
                    last_kill: null
                  }
                ]
              }
            }
          ]
        },
        fight: {
          name: '战斗',
          method: 'POST',
          url: '/api/v1/boss/fight',
          description:
            '输入ninja_id为忍者编号，boss_id为BOSS编号，返回战斗记录。执行战斗将会造成忍者和BOSS的状态变化，可能有一方阵亡，BOSS死后经过一段时间会自动复活，届时可以再次挑战。返回的数组，每个元素表示这个时候场上状态，left为忍者的剩余体力，right为BOSS的剩余体力，message为这一时刻的战斗描述。',
          examples: [
            {
              description: '进行战斗',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 1, boss_id: 1 }
              },
              response: {
                ret: 200,
                data: [
                  { left: 100, right: 300, message: '战斗开始！' },
                  {
                    left: 100,
                    right: 282,
                    message: '津田太郎闪亮登场，高等数学受到了18点伤害。'
                  },
                  {
                    left: 80,
                    right: 282,
                    message: '高等数学闪亮登场，津田太郎受到了20点伤害。'
                  },
                  { '...': '...' },
                  { left: 0, right: 66, message: '津田太郎倒下了，战败！' }
                ]
              }
            }
          ]
        }
      }
    }
  }
}

const v2 = {
  version: 'v2',
  intro: {
    description:
      '此项目接口具有统一规范，响应体ret为200时表示请求有效运行正常。响应体ret为400以及以上时表示请求无效不能完成请求。一般响应只有200和500两种状态，如果可能出现200以外的正常状态，在该接口上会另外说明。值得说明的是，500错误也有可能是后端代码错误等原因引起的，请求不可执行或者是纯粹的逻辑问题等（比如佣金不够），错误信息均会由中文写成，如果出现英文错误信息则有可能是后端异常，此时请直接戳董江彬部长。',
    examples: [
      { description: '成功', response: { ret: 200, data: '...' }},
      { description: '失败', response: { ret: 500, msg: '中文错误信息' }}
    ]
  },
  groups: {
    UserAndAuth: {
      name: '注册与登录',
      apis: {
        register: {
          name: '注册v2',
          method: 'POST',
          url: '/api/v1/user/register',
          description:
            '注册一个新用户，已有用户则返回错误。请求体中username是用户名，password是密码，用户名和密码均有长度限制和字符范围限制，注册失败时返回ret为500。',
          examples: [
            {
              description: '正常注册',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'secret' }
              },
              response: { ret: 200, data: '注册成功' }
            },
            {
              description: '如果用户已经存在',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'secret' }
              },
              response: { ret: 500, msg: '用户已存在' }
            }
          ]
        },
        login: {
          name: '登录',
          method: 'POST',
          url: '/api/v1/auth/login',
          description:
            '用户登录，将登录信息保存到session中，一定时间内请求都处于登陆状态。请求体中username是用户名，password是密码。',
          examples: [
            {
              description: '正常登录时',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'secret' }
              },
              response: { ret: 200, data: '登录成功' }
            },
            {
              description: '密码错误时',
              request: {
                params: null,
                query: null,
                body: { username: 'myusername', password: 'error' }
              },
              response: { ret: 500, msg: '用户名或密码错误' }
            }
          ]
        },
        getLoginInfo: {
          name: '获取登录信息',
          method: 'GET',
          url: '/api/v1/auth/get_login_info',
          description:
            '获取当前登录信息，登录成功则返回info为用户详情，否则login为0。',
          examples: [
            {
              description: '如果现在处于登陆状态',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: {
                  login: 1,
                  info: { id: 1, username: 'myusername', money: 100 }
                }
              }
            },
            {
              description: '如果现在处于登出状态',
              request: { params: null, query: null, body: null },
              response: { ret: 200, data: { login: 0 }}
            }
          ]
        },
        logout: {
          name: '登出',
          method: 'POST',
          url: '/api/v1/auth/logout',
          description: '退出登录，返回退出前状态。',
          examples: [
            {
              description: '如果在登录状态下登出',
              request: { params: null, query: null, body: null },
              response: { ret: 200, data: { login: 1 }}
            },
            {
              description: '如果现在处于登出状态',
              request: { params: null, query: null, body: null },
              response: { ret: 200, data: { login: 0 }}
            }
          ]
        }
      }
    },
    Ninja: {
      name: '忍者雇佣与显示',
      apis: {
        getBoard: {
          name: '获取招募广场信息',
          method: 'GET',
          url: '/api/v1/ninja/get_board',
          description:
            '显示几种忍者，每种忍者的稀有度，以及雇佣它所需要的金钱。响应为数组，每个元素为一种稀有度忍者的雇佣信息：rarity为这种忍者的稀有度，1代表N，2代表R，3代表SR，4代表SSR，5代表UR；cost为雇佣一个忍者所消耗的金钱。雇佣成功后数据库中当前用户的余额自动减少。当前用户钱不够时返回ret500和一条有趣的信息。',
          examples: [
            {
              description: '获取信息',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  { rarity: 1, cost: 5 },
                  { rarity: 2, cost: 75 },
                  { rarity: 3, cost: 200 },
                  { rarity: 4, cost: 750 },
                  { rarity: 5, cost: 2000 }
                ]
              }
            }
          ]
        },
        hire: {
          name: '雇佣一个忍者',
          method: 'POST',
          url: '/api/v1/ninja/hire',
          description:
            '给定一个稀有度，雇佣该种稀有度的忍者，如果钱不够则返回错误。请求体中rarity是要雇佣忍者的稀有度，用数字表示，不要传字符串。返回响应包含两个字段：name表示这个忍者的名字，msg是雇佣信息（自己生成点别的也可以，不一定用这个字段）。',
          examples: [
            {
              description: '钱够',
              request: { params: null, query: null, body: { rarity: 1 }},
              response: {
                ret: 200,
                data: { name: '藤本 浩', msg: '藤本 浩已经归入你麾下' }
              }
            }
          ]
        },
        getMyNinjas: {
          name: '获取从属忍者',
          method: 'GET',
          url: '/api/v1/ninja/get_my_ninjas',
          description:
            '获取你现在所拥有的所有忍者，需要登录。返回数据为一个数组，数组中每个元素代表一个忍者的相关信息，id为这个忍者的唯一标识，其他请求需要以此标识不同的忍者；name是忍者的姓名，忍者过多时可能会重复；atk是这个忍者的攻击力，def是这个忍者的防御力，maxhp是这个忍者的最大体力值；hp是这个忍者的当前体力值，当hp为0时表明此忍者已经死亡；rarity是这个忍者的稀有度，仍然是使用数字表示；skills是一个对象数组，每个元素代表一个技能，name为技能名称，level为该技能当前等级description为技能特性描述，描述会随着技能等级变化而改变',
          examples: [
            {
              description: '处于登陆状态时',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  {
                    id: 1,
                    name: '藤本 浩',
                    atk: 19,
                    def: 16,
                    maxhp: 51,
                    hp: 51,
                    rarity: 2,
                    skills: [
                      {
                        name: '青山之柴',
                        level: 1,
                        description:
                          '战败时有10%的概率不会阵亡，留下1点体力。'
                      },
                      {
                        name: '斩草除根',
                        level: 2,
                        description: '当敌人生命值低于5%时下一次攻击斩杀。'
                      }
                    ]
                  }
                ]
              }
            }
          ]
        },
        cure: {
          name: '治疗某个忍者',
          method: 'POST',
          url: '/api/v1/ninja/cure',
          description:
            '治疗某个忍者，ninja_id表示要治疗的忍者编号，忍者必须没有阵亡，并且隶属于自己。治疗只能一次治疗到满体力，每一点体力金钱消耗为5。',
          examples: [
            {
              description: '忍者从属自己，并且没有死亡。',
              request: { params: null, query: null, body: { ninja_id: 1 }},
              response: { ret: 200, data: '藤本 浩已经活力四射了' }
            }
          ]
        },
        fire: {
          name: '解雇某个忍者',
          method: 'POST',
          url: '/api/v1/ninja/fire',
          description:
            '解雇某个忍者，ninja_id表示要解雇的忍者编号，忍者必须没有阵亡，并且隶属于自己。解雇返回该忍者当前等级对应佣金的80%',
          examples: [
            {
              description: '忍者从属自己，并且没有死亡。',
              request: { params: null, query: null, body: { ninja_id: 1 }},
              response: { ret: 200, data: '藤本浩已经归隐于世了' }
            }
          ]
        }
      }
    },
    Task: {
      name: '任务',
      apis: {
        getAllTask: {
          name: '获取所有的任务',
          method: 'GET',
          url: '/api/v1/task/get_all_task',
          description:
            '获取所有的任务，返回数据为数组，每个元素代表一个任务。id为任务编号，执行任务需要此编号；task_name为任务名；difficulty为任务难度，决定这个任务成功的概率；risk是危险度，决定当任务执行失败后忍者的死亡的概率；cycle_time是任务刷新时间，以秒为单位，执行某任务后需要等待cycle_time秒后才能再执行第二次；reward是任务奖励，即任务执行成功后给的金钱报酬；last_execute是上次执行时间，时间戳单位为秒，即当前用户上次执行此任务的时间，若从未执行过则为null。任务成功率和忍者死亡率还和忍者本身能力相关，具体见执行接口。',
          examples: [
            {
              description: '获取当前所有的任务（包括每个任务上次执行时间）',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  {
                    id: 1,
                    task_name: '巡逻',
                    difficulty: 0,
                    disk: 0,
                    cycle_time: 600,
                    reward: 10,
                    last_execute: 1539187200
                  },
                  {
                    id: 2,
                    task_name: '侦查',
                    difficulty: 10,
                    disk: 5,
                    cycle_time: 600,
                    reward: 10,
                    last_execute: null
                  }
                ]
              }
            }
          ]
        },
        execute: {
          name: '执行任务',
          method: 'POST',
          url: '/api/v1/task/execute',
          description:
            '给定忍者编号和任务编号，让某个忍者执行某个任务。请求体中ninja_id是忍者的编号，task_id是任务的编号。执行任务要求此忍者没有阵亡并且任务处于可执行状态，即上次执行时间距离当前时间超过cycle_time秒。任务难度和危险度将会影响任务执行成功的概率，(100 - difficulty)就是一般情况下任务执行成功的概率，难度为0则100%成功，难度为100则不可能成功。忍者的稀有度影响成功概率，N以上每一个等级增加10%的任务成功率，如难度为80的任务在SR稀有度的忍者手中难度降低为60，成功率为40%。当任务执行失败时有一定概率造成忍者死亡，任务成功则忍者不会死亡，失败的概率与任务危险度相关，risk即为死亡概率，危险度为0则不会死亡，危险度为100则任务失败时忍者必定死亡。类似于难度，忍者的稀有度将会影响危险度，忍者等级N以上每一个等级将减少20的危险度。例如一个SSR稀有度的忍者执行一个危险度为80的任务，如果执行失败则死亡概率仅为(80 - 3 * 20) = 20%，如果是UR稀有度的忍者则执行此任务不会死亡。响应体中的参数task_success表示任务执行是否成功，true为成功，false为失败。参数ninja_dead表示忍者是否死亡，true为死亡，false为存活，参数ninja_level_up是一个对象，内含两个参数表示忍者是否因为此任务升级，ninja_level_up.rarity表示稀有度是否升高，true为稀有度升高，false为稀有度保持不变，ninja_level_up.skills表示是否获得新技能或者技能升级，true为获得了新技能或者技能升级，false为没有获得新技能也没有任何技能获得升级',
          examples: [
            {
              description: '正常执行',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 1, task_id: 1 }
              },
              response: {
                ret: 200,
                data: {
                  task_success: true,
                  ninja_dead: false,
                  ninja_level_up: { rarity: false, skills: false }
                }
              }
            },
            {
              description: '忍者已死亡',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 2, task_id: 1 }
              },
              response: { ret: 500, msg: '这个忍者已经阵亡了' }
            },
            {
              description: '任务暂时不能执行',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 1, task_id: 2 }
              },
              response: { ret: 500, msg: '现在还不能执行这个任务哦！' }
            }
          ]
        }
      }
    },
    Boss: {
      name: '战斗',
      apis: {
        getAllBoss: {
          name: '获取所有的BOSS',
          method: 'GET',
          url: '/api/v1/boss/get_all_boss',
          description:
            '获取所有的BOSS及状态，返回数据为数组，每个元素代表一个任务。id为BOSS编号，挑战BOSS需要此编号；name为BOSS名称；atk为BOSS攻击力；def为BOSS防御力；maxhp为BOSS总体力，即BOSS复活时体力；skills为BOSS所拥有的技能，与忍者技能系统相同；pass为该BOSS共被全服玩家击败过多少次；fail为该BOSS总共消灭掉过多少忍者；cycle_time为BOSS死亡后的复活时；reward为击杀该BOSS所能获得的收益；hp为当前BOSS剩余体力值；last_fight为上次挑战该BOSS的时间；last_kill为上次成功击杀该BOSS的时间。BOSS体力会延续，如果忍者未能击杀该BOSS，则可以换另一个忍者与其战斗，体力仍按上次剩余开始。BOSS死亡后将经过一段时间才能复活，复活后可以再次挑战。',
          examples: [
            {
              description: '获取所有的BOSS以及其状态',
              request: { params: null, query: null, body: null },
              response: {
                ret: 200,
                data: [
                  {
                    id: 1,
                    name: '高等数学',
                    atk: 50,
                    def: 50,
                    maxhp: 300,
                    skills: [
                      {
                        name: '反伤刃甲',
                        level: 3,
                        description: '受到伤害时反射21%的伤害。'
                      },
                      {
                        name: '闪亮登场',
                        level: 4,
                        description:
                          '出场时对敌方造成对方最大生命值20%的伤害。'
                      }
                    ],
                    pass: 0,
                    fail: 0,
                    cycle_time: 600,
                    reward: 1000,
                    hp: null,
                    last_fight: null,
                    last_kill: null
                  }
                ]
              }
            }
          ]
        },
        fight: {
          name: '战斗',
          method: 'POST',
          url: '/api/v1/boss/fight',
          description:
            '输入ninja_id为忍者编号，boss_id为BOSS编号，返回战斗记录。执行战斗将会造成忍者和BOSS的状态变化，可能有一方阵亡，BOSS死后经过一段时间会自动复活，届时可以再次挑战。返回的数组，每个元素表示这个时候场上状态，left为忍者的剩余体力，right为BOSS的剩余体力，message为这一时刻的战斗描述。',
          examples: [
            {
              description: '进行战斗',
              request: {
                params: null,
                query: null,
                body: { ninja_id: 1, boss_id: 1 }
              },
              response: {
                ret: 200,
                data: [
                  { left: 100, right: 300, message: '战斗开始！' },
                  {
                    left: 100,
                    right: 282,
                    message: '津田太郎闪亮登场，高等数学受到了18点伤害。'
                  },
                  {
                    left: 80,
                    right: 282,
                    message: '高等数学闪亮登场，津田太郎受到了20点伤害。'
                  },
                  { '...': '...' },
                  { left: 0, right: 66, message: '津田太郎倒下了，战败！' }
                ]
              }
            }
          ]
        }
      }
    }
  }
}

export default [
  v1,
  v2
]

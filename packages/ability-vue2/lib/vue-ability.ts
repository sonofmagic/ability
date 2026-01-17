type AbilityLike = import('./types').AbilityLike

declare module 'vue' {
  interface Vue {
    $ability?: AbilityLike
    $can?: AbilityLike['can']
  }
}

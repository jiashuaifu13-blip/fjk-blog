import {
  PetActionCatalog,
} from "./PetActionCatalog.js";


export class PetActionSelector {

  constructor({
    library,
    catalog =
      PetActionCatalog,
    random =
      Math.random,
  }) {

    this.library =
      library;

    this.catalog =
      catalog;

    this.random =
      random;

    this.lastActionByState =
      new Map();

    this.lastActionId =
      null;
  }


  /*
   * ==========================================================
   * Availability
   * ==========================================================
   */

  isAvailable(
    action
  ) {

    if (
      !action ||
      !action.id
    ) {
      return false;
    }


    if (
      !this.library
    ) {
      return true;
    }


    return this.library.has(
      action.id
    );
  }


  getAvailableActions() {

    return this.catalog.filter(
      (action) =>
        this.isAvailable(
          action
        )
    );
  }


  /*
   * ==========================================================
   * Query
   * ==========================================================
   */

  getCandidates({
    state,
    tags = [],
  }) {

    const requestedTags =
      Array.isArray(tags)
        ? tags.filter(Boolean)
        : [];


    let candidates =
      this.catalog.filter(
        (action) => {

          if (
            !this.isAvailable(
              action
            )
          ) {
            return false;
          }


          if (
            state &&
            !action.states.includes(
              state
            )
          ) {
            return false;
          }


          if (
            requestedTags.length >
            0 &&
            !requestedTags.every(
              (tag) =>
                action.tags.includes(
                  tag
                )
            )
          ) {
            return false;
          }


          return true;
        }
      );


    /*
     * 如果标签筛选太严格，
     * 自动退回到仅按状态筛选。
     */
    if (
      candidates.length === 0 &&
      requestedTags.length > 0
    ) {

      candidates =
        this.catalog.filter(
          (action) =>
            this.isAvailable(
              action
            ) &&
            (
              !state ||
              action.states.includes(
                state
              )
            )
        );
    }


    return candidates;
  }


  /*
   * ==========================================================
   * Weighted Random
   * ==========================================================
   */

  weightedPick(
    actions
  ) {

    if (
      actions.length === 0
    ) {
      return null;
    }


    if (
      actions.length === 1
    ) {
      return actions[0];
    }


    const totalWeight =
      actions.reduce(
        (
          total,
          action
        ) =>
          total +
          Math.max(
            0,
            Number(
              action.weight ??
              1
            )
          ),
        0
      );


    if (
      totalWeight <= 0
    ) {

      const index =
        Math.floor(
          this.random() *
          actions.length
        );


      return actions[
        index
      ];
    }


    let cursor =
      this.random() *
      totalWeight;


    for (
      const action
      of actions
    ) {

      cursor -=
        Math.max(
          0,
          Number(
            action.weight ??
            1
          )
        );


      if (
        cursor <= 0
      ) {
        return action;
      }
    }


    return actions[
      actions.length - 1
    ];
  }


  /*
   * ==========================================================
   * Selection
   * ==========================================================
   */

  select({
    state,
    tags = [],
    avoidRepeat = true,
  }) {

    let candidates =
      this.getCandidates({
        state,
        tags,
      });


    if (
      candidates.length === 0
    ) {

      throw new Error(
        `No available pet action for state: ${state}`
      );
    }


    const previousForState =
      this.lastActionByState.get(
        state
      );


    /*
     * 同一个状态尽量不要连续两次选到同一动作。
     */
    if (
      avoidRepeat &&
      candidates.length > 1
    ) {

      const filtered =
        candidates.filter(
          (action) =>
            action.id !==
            previousForState &&
            action.id !==
            this.lastActionId
        );


      if (
        filtered.length > 0
      ) {
        candidates =
          filtered;
      }
    }


    const selected =
      this.weightedPick(
        candidates
      );


    if (
      !selected
    ) {

      throw new Error(
        `Unable to select pet action for state: ${state}`
      );
    }


    this.lastActionByState.set(
      state,
      selected.id
    );


    this.lastActionId =
      selected.id;


    return selected;
  }


  /*
   * ==========================================================
   * Direct Lookup
   * ==========================================================
   */

  selectById(
    actionId
  ) {

    const action =
      this.catalog.find(
        (item) =>
          item.id ===
          actionId
      );


    if (
      !action
    ) {

      throw new Error(
        `Unknown pet action: ${actionId}`
      );
    }


    if (
      !this.isAvailable(
        action
      )
    ) {

      throw new Error(
        `Pet action is not loaded: ${actionId}`
      );
    }


    this.lastActionId =
      action.id;


    return action;
  }


  resetHistory() {

    this.lastActionByState.clear();

    this.lastActionId =
      null;
  }

}
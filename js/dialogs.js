/* Native <dialog> + History API: Zurück schließt einen Dialog; Vorwärts stellt ihn wieder her. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const APP = 'periodensystem-v2';
  let profile, compare;
  let fallbackRoute = null;
  let closing = false;
  let previousFocus = null;

  function activeRoute() {
    const state = global.history.state;
    return state && state.pseApp === APP ? state : fallbackRoute;
  }

  function createRoute(dialog, element, other) {
    return { ...(global.history.state || {}), pseApp: APP, pseDialog: dialog,
      pseElement: element ?? null, pseOther: other ?? null };
  }

  function moveTo(route, replace = false) {
    try {
      global.history[replace ? 'replaceState' : 'pushState'](route, '', global.location.href);
      fallbackRoute = null;
    } catch (_) {
      // Einige file://-Browser schränken die History API ein; Dialog bleibt nutzbar.
      fallbackRoute = route;
    }
    sync();
  }

  function sync() {
    closing = false;
    const route = activeRoute();
    const target = route?.pseDialog;
    const validFirst = PSE.byNumber.has(route?.pseElement);
    const validSecond = PSE.byNumber.has(route?.pseOther) && route?.pseOther !== route?.pseElement;
    const showProfile = target === 'profile' && validFirst && PSE.isMobile();
    const showCompare = target === 'compare' && validFirst && validSecond;

    // Nie zwei native Modals gleichzeitig; Back vom Vergleich kann das Profil wieder öffnen.
    if (profile.open && !showProfile) profile.close();
    if (compare.open && !showCompare) compare.close();

    if (showProfile) {
      if (PSE.Store.get().selected !== route.pseElement) PSE.Store.select(route.pseElement);
      if (!profile.open) profile.showModal();
    } else if (showCompare) {
      if (PSE.Store.get().selected !== route.pseElement) PSE.Store.select(route.pseElement);
      PSE.Compare.show(route.pseElement, route.pseOther);
      if (!compare.open) compare.showModal();
    } else if (!profile.open && !compare.open && previousFocus?.isConnected) {
      previousFocus.focus({ preventScroll: true });
    }
    document.body.classList.toggle('modal-open', profile.open || compare.open);
  }

  PSE.Dialogs = {
    init() {
      profile = document.getElementById('profile-dialog');
      compare = document.getElementById('compare-dialog');
      if (!activeRoute()) {
        // Basis-Eintrag kennzeichnen, damit ein Modal immer einen eigenen Zurück-Schritt hat.
        moveTo(createRoute(null, null, null), true);
      }
      for (const modal of [profile, compare]) {
        modal.addEventListener('cancel', event => {
          event.preventDefault();
          PSE.Dialogs.close();
        });
        modal.addEventListener('click', event => {
          if (event.target === modal) PSE.Dialogs.close();
        });
      }
      global.addEventListener('popstate', sync);
      global.matchMedia('(max-width: 1100px)').addEventListener('change', () => {
        if (!PSE.isMobile() && profile.open) PSE.Dialogs.close();
        else sync();
      });
    },
    restore: sync,
    current: activeRoute,
    isOpen: () => !!(profile?.open || compare?.open),
    openProfile(number) {
      if (!PSE.isMobile() || !PSE.byNumber.has(number)) return;
      previousFocus = document.activeElement;
      const current = activeRoute();
      moveTo(createRoute('profile', number), current?.pseDialog === 'profile');
    },
    openCompare(first, second) {
      if (!PSE.byNumber.has(first) || !PSE.byNumber.has(second) || first === second) return;
      if (!profile.open) previousFocus = document.activeElement;
      moveTo(createRoute('compare', first, second));
    },
    updateProfile(number) {
      if (activeRoute()?.pseDialog === 'profile') moveTo(createRoute('profile', number), true);
    },
    updateComparison(second) {
      const route = activeRoute();
      if (route?.pseDialog === 'compare' && route.pseElement !== second) {
        moveTo(createRoute('compare', route.pseElement, second), true);
      }
    },
    close() {
      if (closing || !PSE.Dialogs.isOpen()) return;
      closing = true;
      if (fallbackRoute) {
        fallbackRoute = createRoute(null, null, null);
        sync();
      } else if (activeRoute()?.pseDialog) {
        global.history.back();
      } else {
        if (profile.open) profile.close();
        if (compare.open) compare.close();
        document.body.classList.remove('modal-open');
        closing = false;
      }
    }
  };
})(window);

# Glazier Architecture (or, How Glazier Works)

This document explains how Glazier works, including the underlying components
and how they work together. The intended audience is developers who would like
to contribute to Glazier or to create or work on applications similar to
Glazier.

## What is Glazier?

As you may already know, Glazier is a dashboard application for developers to better understand the open source Github projects they work on, and the ecosystem around those projects.

Each project has a dashboard and each dashboard has a collection of "panes,"
also called cards. Each card has a narrow specific type of data it is designed
to display, and/or functions that it allows the user to take.

## What Makes Glazier Different from Other Dashboards?

Glazier employs an architecture that allows rich communication to, from and
between cards, while isolating each card's code to prevent malicious code
from having direct access to Glazier's back-end.

To achieve this, Glazier uses a library called
[Conductor.js](https://github.com/tildeio/conductor.js),
which in turn uses [Oasis.js](https://github.com/tildeio/oasis.js). These libraries will be discussed below.

## High-Level Architecture

- Diagram TK -

## How the Glazier Container Environment Works
  Ember.js Container
    Conductor
      Oasis
    Integrating Ember.js and Conductor
      Routes
      Services
      Persisting Cards with Ember-Data
  Rails back-end
    Persisting cards
    Persisting card data
  Authentication

## How to Make Your Own Card

yapplabs/glazier-card-bootstrap
yapplabs/glazier-card-grunt-config


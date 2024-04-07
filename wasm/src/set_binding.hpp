#pragma once

#include <functional>
#include <optional>
#include <set>
#include <type_traits>

#include <emscripten/bind.h>
#include <emscripten/val.h>

namespace emscripten
{

template <class T, class TIteratedValue>
struct TNoConversion
{
  TIteratedValue operator()(const T& s) const { return s; }
};

template <typename value_type>
struct TIteratorResult
{
  std::optional<value_type> value;
  //std::optional<bool> done;
  bool done = false;
};

template <class TIterator, typename TIteratedValue/*,
  class TIteratedValueConverter = TNoConversion<typename TIterator::value_type, TIteratedValue>*/
>
class TIteratorWrapper //: public ::emscripten::val
{
public:
  typedef TIteratedValue value_type;

  using TResult = TIteratorResult<value_type>;

  TIteratorWrapper() = default;
  //explicit TIteratorWrapper(::emscripten::val const& other) : emscripten::val(other) {}
  TIteratorWrapper(TIterator pos, TIterator end) : _pos(pos), _end(end)
  {
    ilog("Calling TIteratorWrapper(TIterator pos, TIterator end), range is: ${e}", ("e", _pos != _end ? "NON empty": "empty"));
  }

  TIteratorWrapper thisIterator() const
  {
    ilog("Calling thisIterator");
    return TIteratorWrapper(*this);
  }

  TResult next()
    {
    TResult result;

    ilog("Entering next");

    if (_pos != _end)
    {
      //TIteratedValueConverter conv;
      //auto value = conv(*_pos);
      auto value = *_pos;

      result.done = false;
      result.value = value;

      ilog("Nonempty...");
      ++_pos;
    }
    else
    {
      result.done = true;
    }

    return result;
  }

private:
  TIterator _pos;
  TIterator _end;
};

template <typename T>
class TImmutableSetWrapper
{
public:
  using TUnderlyingSet = std::set<T>;
  using TIterator = TIteratorWrapper<typename TUnderlyingSet::const_iterator, typename TUnderlyingSet::value_type>;

  /*using TEntry = std::pair<typename TUnderlyingSet::value_type, typename TUnderlyingSet::value_type>;

  template <class TSource, class TIteratedValue>
  struct TEntryConverter
  {
    TIteratedValue operator()(const TSource& s) const
    {
      return std::make_pair(s, s);
    }
  };

  using TEntryIterator = TIteratorWrapper < typename TUnderlyingSet::const_iterator, TEntry, TEntryConverter<typename TUnderlyingSet::value_type, TEntry> >;
  */
  static TIterator values(const TUnderlyingSet& c)
  {
    ilog("Calling values");
    for (auto i = c.cbegin(); i != c.cend(); ++i) {
      ilog("Item: ${i}", ("i", *i));
    }

    return TIterator(c.cbegin(), c.cend());
  }

  static TIterator keys(const TUnderlyingSet& c)
  {
    return values(c);
  }

  //static TEntryIterator entries(const TUnderlyingSet& c)
  //{
  //  return TEntryIterator(c.cbegin(), c.cend());
  //}

  static size_t size(const TUnderlyingSet& c)
  {
    return c.size();
  }
};

template<typename K>
class_<std::set<K>> register_set(const char* name) {

#if __cplusplus >= 201703L
  register_optional<K>();
  register_optional<bool>();
#endif

  typedef TImmutableSetWrapper<K> TSetWrapper;
  typedef typename TSetWrapper::TUnderlyingSet TSetType;

  typedef typename TSetWrapper::TIterator TIterator;

  using TIteratorResult = typename TIterator::TResult;

  std::string iterator_typename(name);
  iterator_typename += "_iterator";

  value_object<TIteratorResult>((iterator_typename + "_result").c_str())
    .field("done", &TIterator::TResult::done)
    .field("value", &TIterator::TResult::value)
    ;

  class_<typename TSetWrapper::TIterator>(iterator_typename.c_str())
    .template constructor<>()
    //.function("[Symbol.iterator]", &TIterator::thisIterator)
    .function("@@iterator", &TIterator::thisIterator)
    .function("next", &TIterator::next)
    ;

  /*
  using TEntryIterator = typename TSetWrapper::TEntryIterator;

  using TEntry = typename TSetWrapper::TEntry;

  using TEntryIteratorResult = typename TEntryIterator::TResult;

  std::string entry_iterator_typename(name);
  entry_iterator_typename += "_iterator";

  value_object<TEntry>((std::string(name) + "_entry").c_str())
    .field("first", &TEntry::first)
    .field("second", &TEntry::second)
    ;

  value_object<TEntryIteratorResult>((entry_iterator_typename + "_result").c_str())
    .field("value", &TEntryIteratorResult::value)
    .field("done", &TEntryIteratorResult::done)
    ;

  class_<TEntryIterator>(entry_iterator_typename.c_str())
    .template constructor<>()
    .function("next", &TEntryIterator::next)
    ;
  */

  return class_<TSetType>(name)
    .template constructor<>()
    .function("size", TSetWrapper::size)
    .function("keys", TSetWrapper::keys)
    .function("values", &TSetWrapper::values)
    //.function("[Symbol.iterator]", &TSetWrapper::values)
    .function("@@iterator", &TSetWrapper::values)
    //.function("entries", TSetWrapper::entries)
    ;
}

} /// emscripten
